import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// Pythagorean letter values
const PYTHAGOREAN = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
};

const MASTER_NUMBERS = [11, 22, 33];

// Reduce step by step to find master numbers along the way
const reduceWithMasterDetection = (num) => {
  const mastersFound = [];
  let current = num;
  
  // Check if starting number is a master
  if (MASTER_NUMBERS.includes(current)) {
    mastersFound.push(current);
  }
  
  // Reduce step by step, checking for masters at each step
  while (current > 9) {
    current = String(current).split('').reduce((sum, d) => sum + parseInt(d), 0);
    if (MASTER_NUMBERS.includes(current)) {
      mastersFound.push(current);
    }
  }
  
  return { reduced: current, mastersFound };
};

// Calculate name value for blackjack
const calculateBlackjackName = (name) => {
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
  let rawTotal = 0;
  
  for (const letter of cleanName) {
    rawTotal += PYTHAGOREAN[letter] || 0;
  }
  
  const { reduced, mastersFound } = reduceWithMasterDetection(rawTotal);
  
  // For gameplay: master numbers become 2, 4, 6
  const masterToGameValue = { 11: 2, 22: 4, 33: 6 };
  const hasMaster = mastersFound.length > 0;
  const primaryMaster = mastersFound[0] || null;
  
  return {
    name,
    raw_value: rawTotal,
    reduced_value: reduced,
    master_numbers: mastersFound,
    has_master: hasMaster,
    display_value: hasMaster ? `${rawTotal}/${primaryMaster}/${reduced}` : `${rawTotal}/${reduced}`,
    game_value: reduced // Always 1-9 for blackjack gameplay
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