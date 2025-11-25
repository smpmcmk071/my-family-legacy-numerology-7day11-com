// AI Personalities with distinct strategies
export const AI_PERSONALITIES = {
  aggressive: {
    name: 'Aggressive',
    description: 'High risk, high reward. More criticals, less defense.',
    attackMod: 1.3,
    defenseMod: 0.7,
    critBonus: 0.15,
    healThreshold: 0.15, // Only heals when very low
    specialTriggerMod: 1.2,
    preferredActions: ['power_strike', 'berserk', 'critical_focus']
  },
  defensive: {
    name: 'Defensive',
    description: 'Turtle strategy. High defense, regeneration focused.',
    attackMod: 0.8,
    defenseMod: 1.4,
    critBonus: 0,
    healThreshold: 0.5, // Heals more often
    specialTriggerMod: 0.8,
    preferredActions: ['shield_up', 'regenerate', 'counter']
  },
  balanced: {
    name: 'Balanced',
    description: 'Adapts to the situation. Versatile fighter.',
    attackMod: 1.0,
    defenseMod: 1.0,
    critBonus: 0.05,
    healThreshold: 0.3,
    specialTriggerMod: 1.0,
    preferredActions: ['standard_attack', 'tactical_strike', 'adapt']
  },
  berserker: {
    name: 'Berserker',
    description: 'Gets stronger as HP drops. Dangerous when wounded.',
    attackMod: 1.0,
    defenseMod: 0.9,
    critBonus: 0.1,
    healThreshold: 0.1,
    specialTriggerMod: 1.5,
    preferredActions: ['rage', 'berserk', 'last_stand'],
    lowHpBonus: true // Attack increases as HP drops
  },
  tactician: {
    name: 'Tactician',
    description: 'Analyzes opponent weaknesses. Strategic strikes.',
    attackMod: 1.1,
    defenseMod: 1.1,
    critBonus: 0.08,
    healThreshold: 0.35,
    specialTriggerMod: 1.1,
    preferredActions: ['analyze', 'exploit_weakness', 'tactical_strike'],
    exploitsWeakness: true
  }
};

// Special abilities that can trigger during battle
export const SPECIAL_ABILITIES = {
  // Offensive abilities
  power_strike: {
    name: 'Power Strike',
    type: 'offensive',
    damage_mult: 1.8,
    trigger: 'random',
    triggerChance: 0.12,
    description: 'A devastating blow dealing 80% extra damage'
  },
  berserk: {
    name: 'Berserk',
    type: 'buff',
    attackBoost: 1.5,
    defenseReduction: 0.7,
    duration: 2,
    trigger: 'low_hp',
    triggerThreshold: 0.3,
    description: 'Rage mode: +50% attack, -30% defense for 2 turns'
  },
  critical_focus: {
    name: 'Critical Focus',
    type: 'buff',
    critBoost: 0.4,
    duration: 3,
    trigger: 'random',
    triggerChance: 0.1,
    description: 'Focus intensifies, +40% crit chance for 3 turns'
  },
  
  // Defensive abilities
  shield_up: {
    name: 'Shield Wall',
    type: 'defensive',
    defenseBoost: 2.0,
    duration: 1,
    trigger: 'low_hp',
    triggerThreshold: 0.4,
    description: 'Raise defenses, doubling defense for 1 turn'
  },
  regenerate: {
    name: 'Deep Regeneration',
    type: 'heal',
    healPercent: 0.2,
    trigger: 'low_hp',
    triggerThreshold: 0.5,
    description: 'Heal 20% of max HP'
  },
  counter: {
    name: 'Counter Stance',
    type: 'counter',
    counterChance: 0.5,
    counterDamage: 0.6,
    trigger: 'random',
    triggerChance: 0.15,
    description: '50% chance to counter attack for 60% damage'
  },
  
  // Special triggers
  last_stand: {
    name: 'Last Stand',
    type: 'buff',
    attackBoost: 2.0,
    evasionBoost: 20,
    duration: 2,
    trigger: 'critical_hp',
    triggerThreshold: 0.15,
    oneTime: true,
    description: 'At death\'s door, gain massive power boost'
  },
  elemental_surge: {
    name: 'Elemental Surge',
    type: 'offensive',
    damage_mult: 1.5,
    trigger: 'elemental_advantage',
    description: 'Elemental affinity amplifies attack by 50%'
  },
  numerology_sync: {
    name: 'Numerology Sync',
    type: 'buff',
    allStats: 1.15,
    duration: 2,
    trigger: 'life_path_match',
    description: 'Numbers align, all stats +15% for 2 turns'
  },
  
  // Tactical abilities
  analyze: {
    name: 'Analyze',
    type: 'debuff',
    enemyDefenseReduce: 0.8,
    duration: 2,
    trigger: 'first_turn',
    description: 'Study opponent, reduce their defense by 20%'
  },
  exploit_weakness: {
    name: 'Exploit Weakness',
    type: 'offensive',
    damage_mult: 1.4,
    trigger: 'enemy_debuffed',
    description: 'Strike at weak points for 40% extra damage'
  }
};

// Determine AI personality based on numerology
export function determinePersonality(member) {
  const lifePath = member.life_path_western;
  const element = member.element;
  
  // Life path influences personality
  if ([1, 8].includes(lifePath)) return 'aggressive';
  if ([2, 6].includes(lifePath)) return 'defensive';
  if ([3, 5].includes(lifePath)) return 'berserker';
  if ([7, 9].includes(lifePath)) return 'tactician';
  if ([11, 22, 33].includes(lifePath)) return 'tactician'; // Master numbers are strategic
  
  // Element fallback
  if (element === 'Fire') return 'aggressive';
  if (element === 'Earth') return 'defensive';
  if (element === 'Water') return 'balanced';
  if (element === 'Air') return 'tactician';
  
  return 'balanced';
}

// AI decision making based on battle state
export function makeAIDecision(attacker, defender, personality, turnNumber, activeBuffs = {}) {
  const attackerHpPercent = attacker.currentHp / attacker.health;
  const defenderHpPercent = defender.currentHp / defender.health;
  const personalityConfig = AI_PERSONALITIES[personality];
  
  const decision = {
    action: 'attack',
    modifier: 1.0,
    specialTriggered: null,
    message: null
  };
  
  // Check for special ability triggers
  const triggeredAbility = checkSpecialTriggers(
    attacker, defender, personality, turnNumber, activeBuffs, attackerHpPercent, defenderHpPercent
  );
  
  if (triggeredAbility) {
    decision.specialTriggered = triggeredAbility;
    decision.message = `✨ ${attacker.name} activates ${triggeredAbility.name}!`;
  }
  
  // Berserker bonus: More damage at low HP
  if (personalityConfig.lowHpBonus && attackerHpPercent < 0.5) {
    const bonus = 1 + (0.5 - attackerHpPercent); // Up to +50% at very low HP
    decision.modifier *= bonus;
    if (attackerHpPercent < 0.3 && !decision.message) {
      decision.message = `🔥 ${attacker.name}'s rage intensifies!`;
    }
  }
  
  // Tactician: Exploit weakness when defender is debuffed or low HP
  if (personalityConfig.exploitsWeakness) {
    if (defenderHpPercent < 0.4 || activeBuffs.enemyDebuffed) {
      decision.modifier *= 1.2;
      if (!decision.message) {
        decision.message = `🎯 ${attacker.name} strikes at a weak point!`;
      }
    }
  }
  
  // Apply personality attack modifier
  decision.modifier *= personalityConfig.attackMod;
  
  return decision;
}

// Check if any special abilities should trigger
function checkSpecialTriggers(attacker, defender, personality, turnNumber, activeBuffs, attackerHpPercent, defenderHpPercent) {
  const personalityConfig = AI_PERSONALITIES[personality];
  const preferredAbilities = personalityConfig.preferredActions;
  
  // Check each preferred ability
  for (const abilityKey of preferredAbilities) {
    const ability = SPECIAL_ABILITIES[abilityKey];
    if (!ability) continue;
    
    // Check if already used (one-time abilities)
    if (ability.oneTime && activeBuffs[abilityKey + '_used']) continue;
    
    // Check trigger conditions
    let shouldTrigger = false;
    
    switch (ability.trigger) {
      case 'low_hp':
        shouldTrigger = attackerHpPercent <= ability.triggerThreshold;
        break;
      case 'critical_hp':
        shouldTrigger = attackerHpPercent <= ability.triggerThreshold;
        break;
      case 'random':
        const adjustedChance = ability.triggerChance * personalityConfig.specialTriggerMod;
        shouldTrigger = Math.random() < adjustedChance;
        break;
      case 'first_turn':
        shouldTrigger = turnNumber === 1;
        break;
      case 'enemy_debuffed':
        shouldTrigger = activeBuffs.enemyDebuffed && Math.random() < 0.6;
        break;
      case 'elemental_advantage':
        shouldTrigger = activeBuffs.hasElementalAdvantage && Math.random() < 0.4;
        break;
    }
    
    if (shouldTrigger) {
      return ability;
    }
  }
  
  return null;
}

// Calculate final damage with AI modifiers
export function calculateAIDamage(baseDamage, attacker, defender, decision, activeBuffs) {
  let damage = baseDamage * decision.modifier;
  
  // Apply special ability effects
  if (decision.specialTriggered) {
    const ability = decision.specialTriggered;
    
    if (ability.type === 'offensive') {
      damage *= ability.damage_mult;
    }
  }
  
  // Apply active buffs
  if (activeBuffs.attackBoost) {
    damage *= activeBuffs.attackBoost;
  }
  
  return Math.floor(damage);
}

// Calculate defense with AI modifiers
export function calculateAIDefense(baseDefense, personality, activeBuffs, hpPercent) {
  const personalityConfig = AI_PERSONALITIES[personality];
  let defense = baseDefense * personalityConfig.defenseMod;
  
  // Berserk reduces defense
  if (activeBuffs.berserkActive) {
    defense *= 0.7;
  }
  
  // Shield active
  if (activeBuffs.shieldActive) {
    defense *= 2.0;
  }
  
  return defense;
}

// Get AI crit chance
export function getAICritChance(baseCrit, personality, activeBuffs) {
  const personalityConfig = AI_PERSONALITIES[personality];
  let crit = baseCrit + personalityConfig.critBonus;
  
  if (activeBuffs.critFocusActive) {
    crit += 0.4;
  }
  
  return Math.min(0.8, crit); // Cap at 80%
}

// Process healing decisions
export function shouldAIHeal(attacker, personality, activeBuffs) {
  const personalityConfig = AI_PERSONALITIES[personality];
  const hpPercent = attacker.currentHp / attacker.health;
  
  return hpPercent <= personalityConfig.healThreshold && attacker.regen > 0;
}

// Get enhanced regen amount
export function getAIRegenAmount(baseRegen, personality, specialAbility) {
  if (specialAbility && specialAbility.type === 'heal') {
    return specialAbility.healPercent; // Return as percentage
  }
  return baseRegen;
}