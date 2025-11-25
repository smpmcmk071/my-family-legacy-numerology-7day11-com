import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// Pythagorean letter values
const PYTHAGOREAN = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
};

// Reduce to single digit (NO master numbers - always reduce)
const reduceToSingle = (num) => {
  while (num > 9) {
    num = String(num).split('').reduce((sum, d) => sum + parseInt(d), 0);
  }
  return num;
};

// Calculate name value for blackjack
const calculateBlackjackName = (name) => {
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
  let rawTotal = 0;
  
  for (const letter of cleanName) {
    rawTotal += PYTHAGOREAN[letter] || 0;
  }
  
  const reduced = reduceToSingle(rawTotal);
  
  return {
    name,
    raw_value: rawTotal,
    reduced_value: reduced
  };
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, names } = await req.json();
    
    // Single name calculation
    if (name) {
      const result = calculateBlackjackName(name);
      return Response.json({ success: true, data: result });
    }
    
    // Batch calculation for multiple names
    if (names && Array.isArray(names)) {
      const results = names.map(n => calculateBlackjackName(n));
      return Response.json({ success: true, data: results });
    }

    return Response.json({ error: 'Provide name or names array' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});