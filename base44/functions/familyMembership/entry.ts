import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

function makeInviteCode(name) {
  const base = String(name || '').replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 5) || 'FAMILY';
  return base + Math.floor(Math.random() * 900 + 100);
}

async function familyByCode(base44, code) {
  const families = await base44.asServiceRole.entities.Family.filter({ invite_code: code });
  return families[0] || null;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const action = body.action;

    // Look up a family by invite code without exposing the family list.
    if (action === 'lookup') {
      const code = String(body.inviteCode || '').toUpperCase().trim();
      if (!code) return Response.json({ error: 'Invite code required' }, { status: 400 });
      const family = await familyByCode(base44, code);
      if (!family) return Response.json({ error: 'No family found with that code. Check the code and try again.' }, { status: 404 });
      return Response.json({ family: { id: family.id, name: family.name, member_limit: family.member_limit || 5 } });
    }

    // Validate the invite code server-side, then link the caller to that family.
    if (action === 'join') {
      const code = String(body.inviteCode || '').toUpperCase().trim();
      if (!code) return Response.json({ error: 'Invite code required' }, { status: 400 });
      const family = await familyByCode(base44, code);
      if (!family) return Response.json({ error: 'No family found with that code. Check the code and try again.' }, { status: 404 });

      if (user.family_id && user.family_id !== family.id) {
        return Response.json({ error: 'You already belong to a family.' }, { status: 400 });
      }

      const members = await base44.asServiceRole.entities.FamilyMember.filter({ family_id: family.id });
      const limit = family.member_limit || 5;
      if (members.length >= limit) {
        return Response.json({ error: `This family has reached its member limit (${limit}). Ask the family admin to upgrade.` }, { status: 400 });
      }

      await base44.asServiceRole.entities.User.update(user.id, { family_id: family.id });
      return Response.json({ family: { id: family.id, name: family.name, member_limit: limit } });
    }

    // Create a family for the caller and make them its admin.
    if (action === 'create') {
      const name = String(body.name || '').trim();
      if (!name) return Response.json({ error: 'Family name required' }, { status: 400 });

      if (user.family_id) {
        const existing = await base44.asServiceRole.entities.Family.get(user.family_id)
          .catch((e) => (e.status === 404 ? null : Promise.reject(e)));
        if (existing) return Response.json({ family: existing });
      }

      const family = await base44.asServiceRole.entities.Family.create({
        name,
        admin_email: user.email,
        description: `Family group for ${name}`,
        invite_code: makeInviteCode(name)
      });
      await base44.asServiceRole.entities.User.update(user.id, { family_id: family.id });
      return Response.json({ family });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}