import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// Simple AES-like encryption using Web Crypto API
const ENCRYPTION_KEY = Deno.env.get("ENCRYPTION_KEY") || "default-key-change-in-production-32";

async function getKey() {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32));
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encrypt(text) {
  if (!text) return null;
  const key = await getKey();
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(text)
  );
  // Combine IV and encrypted data, encode as base64
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  return btoa(String.fromCharCode(...combined));
}

async function decrypt(encryptedBase64) {
  if (!encryptedBase64) return null;
  try {
    const key = await getKey();
    const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    return new TextDecoder().decode(decrypted);
  } catch (e) {
    // Return original if decryption fails (might be unencrypted legacy data)
    return encryptedBase64;
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, data, memberId } = body;

    if (action === 'encrypt') {
      // Encrypt sensitive fields
      const encrypted = {
        birth_date_encrypted: data.birth_date ? await encrypt(data.birth_date) : null,
        birth_place_encrypted: data.birth_place ? await encrypt(data.birth_place) : null,
        birth_time_encrypted: data.birth_time ? await encrypt(data.birth_time) : null,
        email_encrypted: data.email ? await encrypt(data.email) : null,
      };
      return Response.json({ success: true, encrypted });
    }

    if (action === 'decrypt') {
      // Only admins can decrypt
      if (user.role !== 'admin') {
        return Response.json({ error: 'Admin access required' }, { status: 403 });
      }

      const decrypted = {
        birth_date: data.birth_date_encrypted ? await decrypt(data.birth_date_encrypted) : data.birth_date,
        birth_place: data.birth_place_encrypted ? await decrypt(data.birth_place_encrypted) : data.birth_place,
        birth_time: data.birth_time_encrypted ? await decrypt(data.birth_time_encrypted) : data.birth_time,
        email: data.email_encrypted ? await decrypt(data.email_encrypted) : data.email,
      };
      return Response.json({ success: true, decrypted });
    }

    if (action === 'decryptMember') {
      // Decrypt a full member record - admin only
      if (user.role !== 'admin') {
        return Response.json({ error: 'Admin access required' }, { status: 403 });
      }

      const member = await base44.entities.FamilyMember.get(memberId);
      if (!member) {
        return Response.json({ error: 'Member not found' }, { status: 404 });
      }

      const decrypted = {
        ...member,
        birth_date: member.birth_date_encrypted ? await decrypt(member.birth_date_encrypted) : member.birth_date,
        birth_place: member.birth_place_encrypted ? await decrypt(member.birth_place_encrypted) : member.birth_place,
        birth_time: member.birth_time_encrypted ? await decrypt(member.birth_time_encrypted) : member.birth_time,
        email: member.email_encrypted ? await decrypt(member.email_encrypted) : member.email,
      };
      return Response.json({ success: true, member: decrypted });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});