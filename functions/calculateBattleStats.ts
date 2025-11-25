import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// Zodiac elements for compatibility
const ZODIAC_ELEMENTS = {
  "Aries": "fire", "Leo": "fire", "Sagittarius": "fire",
  "Taurus": "earth", "Virgo": "earth", "Capricorn": "earth",
  "Gemini": "air", "Libra": "air", "Aquarius": "air",
  "Cancer": "water", "Scorpio": "water", "Pisces": "water"
};

// Element interactions
const ELEMENT_ADVANTAGES = {
  "fire": { strong: "air", weak: "water" },
  "water": { strong: "fire", weak: "earth" },
  "earth": { strong: "water", weak: "air" },
  "air": { strong: "earth", weak: "fire" }
};

// Base stat modifiers by life path
const LIFE_PATH_STATS = {
  1: { attack: 3, speed: 2, charisma: 1 },
  2: { defense: 2, wisdom: 2, regen: 1 },
  3: { charisma: 3, speed: 1, attack: 1 },
  4: { defense: 3, health: 2, wisdom: 1 },
  5: { speed: 3, evasion: 2, attack: 1 },
  6: { health: 2, regen: 2, defense: 1 },
  7: { wisdom: 4, evasion: 1, regen: 1 },
  8: { attack: 2, health: 2, charisma: 2 },
  9: { wisdom: 2, charisma: 2, regen: 2 },
  11: { wisdom: 4, charisma: 2, speed: 2 },
  22: { health: 4, defense: 3, attack: 2 },
  33: { regen: 4, wisdom: 3, charisma: 3 }
};

// Expression/Destiny stat modifiers
const EXPRESSION_STATS = {
  1: { attack: 2 }, 2: { defense: 2 }, 3: { charisma: 2 },
  4: { health: 2 }, 5: { evasion: 2 }, 6: { regen: 2 },
  7: { wisdom: 2 }, 8: { attack: 1, defense: 1 }, 9: { wisdom: 1, charisma: 1 },
  11: { wisdom: 3 }, 22: { health: 3 }, 33: { regen: 3 }
};

// Soul urge modifiers (inner motivation affects regen and wisdom)
const SOUL_URGE_STATS = {
  1: { speed: 1 }, 2: { regen: 1 }, 3: { charisma: 1 },
  4: { defense: 1 }, 5: { evasion: 1 }, 6: { health: 1 },
  7: { wisdom: 2 }, 8: { attack: 1 }, 9: { regen: 1 },
  11: { wisdom: 2 }, 22: { defense: 2 }, 33: { regen: 2 }
};

// Personality modifiers (outer appearance affects evasion and charisma)
const PERSONALITY_STATS = {
  1: { charisma: 1 }, 2: { evasion: 1 }, 3: { charisma: 2 },
  4: { defense: 1 }, 5: { evasion: 2 }, 6: { charisma: 1 },
  7: { evasion: 1 }, 8: { charisma: 2 }, 9: { wisdom: 1 },
  11: { evasion: 2 }, 22: { charisma: 2 }, 33: { wisdom: 2 }
};

// Karmic debt penalties
const KARMIC_DEBT_PENALTIES = {
  13: { speed: -1, evasion: -1 },
  14: { health: -2, regen: -1 },
  16: { charisma: -2, defense: -1 },
  19: { wisdom: -1, attack: -1 }
};

// Calculate personal year (affects temporary buffs)
function calculatePersonalYear(birthDate, currentDate = new Date()) {
  const [year, month, day] = birthDate.split('-').map(Number);
  const currentYear = currentDate.getFullYear();
  
  const reduceToDigit = (num) => {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
      num = String(num).split('').reduce((a, b) => a + parseInt(b), 0);
    }
    return num;
  };
  
  const birthSum = reduceToDigit(month + day);
  const yearSum = reduceToDigit(currentYear);
  return reduceToDigit(birthSum + yearSum);
}

// Personal year battle effects
const PERSONAL_YEAR_EFFECTS = {
  1: { speed: 2, attack: 1 },
  2: { defense: 2, regen: 1 },
  3: { charisma: 2, speed: 1 },
  4: { defense: 2, health: 1 },
  5: { evasion: 3, speed: 1 },
  6: { health: 2, regen: 1 },
  7: { wisdom: 3, evasion: 1 },
  8: { attack: 2, charisma: 1 },
  9: { wisdom: 2, regen: 2 },
  11: { wisdom: 3, charisma: 2 },
  22: { health: 3, attack: 2 },
  33: { regen: 3, wisdom: 2 }
};

// Calculate pinnacles (life phases)
function calculatePinnacles(birthDate) {
  const [year, month, day] = birthDate.split('-').map(Number);
  
  const reduceToDigit = (num) => {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
      num = String(num).split('').reduce((a, b) => a + parseInt(b), 0);
    }
    return num;
  };
  
  const monthReduced = reduceToDigit(month);
  const dayReduced = reduceToDigit(day);
  const yearReduced = reduceToDigit(year);
  
  return [
    reduceToDigit(monthReduced + dayReduced),
    reduceToDigit(dayReduced + yearReduced),
    reduceToDigit(monthReduced + dayReduced + dayReduced + yearReduced),
    reduceToDigit(monthReduced + yearReduced)
  ];
}

// Calculate ancestral bonus from family members
function calculateAncestralBonus(familyMembers, currentMemberId) {
  if (!familyMembers || familyMembers.length <= 1) return { health: 0, wisdom: 0 };
  
  const ancestors = familyMembers.filter(m => 
    m.id !== currentMemberId && 
    ['grandparent', 'great-grandparent', 'parent'].includes(m.relationship)
  );
  
  if (ancestors.length === 0) return { health: 0, wisdom: 0 };
  
  let totalLifePath = 0;
  let masterCount = 0;
  
  ancestors.forEach(a => {
    totalLifePath += a.life_path_western || 0;
    if ([11, 22, 33].includes(a.life_path_western)) masterCount++;
  });
  
  return {
    health: Math.floor(totalLifePath / ancestors.length / 2),
    wisdom: masterCount,
    ancestorCount: ancestors.length
  };
}

// Calculate compatibility modifier between two players
function calculateCompatibility(player1, player2) {
  let modifier = 1.0;
  
  // Elemental compatibility
  const elem1 = ZODIAC_ELEMENTS[player1.sun_sign] || 'neutral';
  const elem2 = ZODIAC_ELEMENTS[player2.sun_sign] || 'neutral';
  
  if (elem1 !== 'neutral' && elem2 !== 'neutral') {
    if (ELEMENT_ADVANTAGES[elem1]?.strong === elem2) {
      modifier += 0.15;
    } else if (ELEMENT_ADVANTAGES[elem1]?.weak === elem2) {
      modifier -= 0.1;
    } else if (elem1 === elem2) {
      modifier += 0.05;
    }
  }
  
  // Life path harmony
  const lp1 = player1.life_path_western || 0;
  const lp2 = player2.life_path_western || 0;
  const lpDiff = Math.abs(lp1 - lp2);
  
  if (lpDiff === 0) {
    modifier += 0.1; // Same life path - deep understanding
  } else if ([2, 4, 6].includes(lpDiff)) {
    modifier += 0.05; // Harmonious difference
  } else if ([1, 3, 5].includes(lpDiff)) {
    modifier -= 0.05; // Challenging difference
  }
  
  // Master number bonus
  if ([11, 22, 33].includes(lp1)) modifier += 0.1;
  
  return Math.round(modifier * 100) / 100;
}

// Derive full battle stats for a player
function deriveBattleStats(member, familyMembers, customMappings = []) {
  // Base stats
  const stats = {
    health: 20,
    attack: 5,
    defense: 3,
    evasion: 2,
    speed: 5,
    regen: 0,
    wisdom: 0,
    charisma: 0,
    critChance: 0.1,
    specialAbilities: []
  };
  
  // Apply life path modifiers
  const lpMods = LIFE_PATH_STATS[member.life_path_western] || LIFE_PATH_STATS[member.life_path_western % 9 || 9];
  if (lpMods) {
    Object.keys(lpMods).forEach(stat => {
      stats[stat] = (stats[stat] || 0) + lpMods[stat];
    });
  }
  
  // Apply expression modifiers
  const exprMods = EXPRESSION_STATS[member.expression_western] || EXPRESSION_STATS[member.expression_western % 9 || 9];
  if (exprMods) {
    Object.keys(exprMods).forEach(stat => {
      stats[stat] = (stats[stat] || 0) + exprMods[stat];
    });
  }
  
  // Apply soul urge modifiers
  const suMods = SOUL_URGE_STATS[member.soul_urge_western] || SOUL_URGE_STATS[member.soul_urge_western % 9 || 9];
  if (suMods) {
    Object.keys(suMods).forEach(stat => {
      stats[stat] = (stats[stat] || 0) + suMods[stat];
    });
  }
  
  // Apply personality modifiers
  const persMods = PERSONALITY_STATS[member.personality_western] || PERSONALITY_STATS[member.personality_western % 9 || 9];
  if (persMods) {
    Object.keys(persMods).forEach(stat => {
      stats[stat] = (stats[stat] || 0) + persMods[stat];
    });
  }
  
  // Apply karmic debt penalties
  if (member.karmic_debt_number) {
    const debts = member.karmic_debt_number.split(',').map(d => parseInt(d.trim()));
    debts.forEach(debt => {
      const penalties = KARMIC_DEBT_PENALTIES[debt];
      if (penalties) {
        Object.keys(penalties).forEach(stat => {
          stats[stat] = (stats[stat] || 0) + penalties[stat];
        });
        stats.specialAbilities.push(`Karmic Debt ${debt}`);
      }
    });
  }
  
  // Apply personal year effects
  if (member.birth_date) {
    const personalYear = calculatePersonalYear(member.birth_date);
    const pyEffects = PERSONAL_YEAR_EFFECTS[personalYear] || {};
    Object.keys(pyEffects).forEach(stat => {
      stats[stat] = (stats[stat] || 0) + pyEffects[stat];
    });
    stats.personalYear = personalYear;
  }
  
  // Calculate pinnacles
  if (member.birth_date) {
    stats.pinnacles = calculatePinnacles(member.birth_date);
  }
  
  // Apply ancestral bonus
  const ancestral = calculateAncestralBonus(familyMembers, member.id);
  stats.health += ancestral.health;
  stats.wisdom += ancestral.wisdom;
  stats.ancestralBonus = ancestral;
  
  // Master number bonuses
  if (member.master_numbers) {
    const masters = member.master_numbers.split(',').map(m => parseInt(m.trim()));
    if (masters.includes(11)) {
      stats.wisdom += 2;
      stats.critChance += 0.05;
      stats.specialAbilities.push('Intuitive Strike (11)');
    }
    if (masters.includes(22)) {
      stats.health += 3;
      stats.defense += 1;
      stats.specialAbilities.push('Master Builder Shield (22)');
    }
    if (masters.includes(33)) {
      stats.regen += 2;
      stats.charisma += 2;
      stats.specialAbilities.push('Healing Aura (33)');
    }
  }
  
  // Apply custom mappings from database
  customMappings.forEach(mapping => {
    if (mapping.health_mod) stats.health += mapping.health_mod;
    if (mapping.attack_mod) stats.attack += mapping.attack_mod;
    if (mapping.defense_mod) stats.defense += mapping.defense_mod;
    if (mapping.evasion_mod) stats.evasion += mapping.evasion_mod;
    if (mapping.speed_mod) stats.speed += mapping.speed_mod;
    if (mapping.regen_mod) stats.regen += mapping.regen_mod;
    if (mapping.wisdom_mod) stats.wisdom += mapping.wisdom_mod;
    if (mapping.charisma_mod) stats.charisma += mapping.charisma_mod;
    if (mapping.crit_chance_mod) stats.critChance += mapping.crit_chance_mod;
    if (mapping.special_ability) stats.specialAbilities.push(mapping.special_ability);
  });
  
  // Ensure minimum values
  stats.health = Math.max(10, stats.health);
  stats.attack = Math.max(1, stats.attack);
  stats.defense = Math.max(0, stats.defense);
  stats.evasion = Math.max(0, stats.evasion);
  stats.speed = Math.max(1, stats.speed);
  stats.regen = Math.max(0, stats.regen);
  stats.critChance = Math.min(0.5, Math.max(0.05, stats.critChance));
  
  return stats;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { action, player1Id, player2Id, memberId } = body;
    
    // Fetch all family members for ancestral calculations
    const allMembers = await base44.entities.FamilyMember.filter({});
    
    // Fetch custom battle mappings
    let customMappings = [];
    try {
      customMappings = await base44.entities.BattleMapping.filter({});
    } catch (e) {
      // Entity might not exist yet
    }
    
    if (action === 'getStats') {
      // Get stats for a single member
      const member = allMembers.find(m => m.id === memberId);
      if (!member) {
        return Response.json({ error: 'Member not found' }, { status: 404 });
      }
      
      // Get relevant mappings for this member
      const memberMappings = customMappings.filter(m => 
        m.number === member.life_path_western ||
        m.number === member.expression_western ||
        m.zodiac_sign === member.sun_sign
      );
      
      const stats = deriveBattleStats(member, allMembers, memberMappings);
      
      return Response.json({
        success: true,
        data: {
          member: {
            id: member.id,
            name: member.nickname || member.full_name,
            lifePath: member.life_path_western,
            expression: member.expression_western,
            soulUrge: member.soul_urge_western,
            personality: member.personality_western,
            sunSign: member.sun_sign,
            element: member.element,
            masterNumbers: member.master_numbers,
            karmicDebt: member.karmic_debt_number
          },
          stats
        }
      });
    }
    
    if (action === 'getBattlePreview') {
      // Get stats for both players
      const player1 = allMembers.find(m => m.id === player1Id);
      const player2 = allMembers.find(m => m.id === player2Id);
      
      if (!player1 || !player2) {
        return Response.json({ error: 'One or both players not found' }, { status: 404 });
      }
      
      const p1Mappings = customMappings.filter(m => 
        m.number === player1.life_path_western || m.zodiac_sign === player1.sun_sign
      );
      const p2Mappings = customMappings.filter(m => 
        m.number === player2.life_path_western || m.zodiac_sign === player2.sun_sign
      );
      
      const p1Stats = deriveBattleStats(player1, allMembers, p1Mappings);
      const p2Stats = deriveBattleStats(player2, allMembers, p2Mappings);
      const compatibility = calculateCompatibility(player1, player2);
      
      return Response.json({
        success: true,
        data: {
          player1: {
            id: player1.id,
            name: player1.nickname || player1.full_name,
            lifePath: player1.life_path_western,
            sunSign: player1.sun_sign,
            element: ZODIAC_ELEMENTS[player1.sun_sign] || 'neutral',
            stats: p1Stats
          },
          player2: {
            id: player2.id,
            name: player2.nickname || player2.full_name,
            lifePath: player2.life_path_western,
            sunSign: player2.sun_sign,
            element: ZODIAC_ELEMENTS[player2.sun_sign] || 'neutral',
            stats: p2Stats
          },
          compatibility,
          battleAdvantage: compatibility > 1.0 ? 'player1' : compatibility < 1.0 ? 'player2' : 'even'
        }
      });
    }
    
    return Response.json({ error: 'Invalid action' }, { status: 400 });
    
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});