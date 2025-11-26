// Pre-built characters for battling - available when user has no family or wants variety
export const BATTLE_CHARACTERS = [
  // Biblical Heroes
  {
    id: 'moses',
    name: 'Moses',
    category: 'biblical',
    life_path_western: 11,
    expression_western: 22,
    soul_urge_western: 7,
    personality_western: 6,
    birthday_number: 7,
    sun_sign: 'Aries',
    element: 'Fire',
    bio: 'Deliverer of Israel, parted the Red Sea',
    special: 'Master Visionary who spoke with God'
  },
  {
    id: 'david',
    name: 'King David',
    category: 'biblical',
    life_path_western: 8,
    expression_western: 9,
    soul_urge_western: 3,
    personality_western: 6,
    birthday_number: 1,
    sun_sign: 'Leo',
    element: 'Fire',
    bio: 'Shepherd king, slayer of Goliath',
    special: 'Warrior poet with the heart of a lion'
  },
  {
    id: 'solomon',
    name: 'King Solomon',
    category: 'biblical',
    life_path_western: 7,
    expression_western: 33,
    soul_urge_western: 11,
    personality_western: 4,
    birthday_number: 22,
    sun_sign: 'Virgo',
    element: 'Earth',
    bio: 'Wisest king, builder of the Temple',
    special: 'Master Teacher with divine wisdom'
  },
  {
    id: 'samson',
    name: 'Samson',
    category: 'biblical',
    life_path_western: 1,
    expression_western: 8,
    soul_urge_western: 5,
    personality_western: 1,
    birthday_number: 8,
    sun_sign: 'Aries',
    element: 'Fire',
    bio: 'Strongest man, Nazarite warrior',
    special: 'Divine strength from uncut hair'
  },
  {
    id: 'elijah',
    name: 'Elijah',
    category: 'biblical',
    life_path_western: 9,
    expression_western: 11,
    soul_urge_western: 22,
    personality_western: 7,
    birthday_number: 9,
    sun_sign: 'Scorpio',
    element: 'Water',
    bio: 'Prophet of fire, taken to heaven',
    special: 'Called fire from heaven'
  },
  {
    id: 'joshua',
    name: 'Joshua',
    category: 'biblical',
    life_path_western: 8,
    expression_western: 1,
    soul_urge_western: 8,
    personality_western: 11,
    birthday_number: 4,
    sun_sign: 'Capricorn',
    element: 'Earth',
    bio: 'Conqueror of Canaan, stopped the sun',
    special: 'Faith strong enough to halt celestial bodies'
  },
  {
    id: 'daniel',
    name: 'Daniel',
    category: 'biblical',
    life_path_western: 7,
    expression_western: 7,
    soul_urge_western: 9,
    personality_western: 7,
    birthday_number: 7,
    sun_sign: 'Pisces',
    element: 'Water',
    bio: 'Prophet in the lion\'s den, dream interpreter',
    special: 'Triple 7 - Ultimate Seeker of Truth'
  },
  
  // Superheroes
  {
    id: 'superman',
    name: 'Superman',
    category: 'superhero',
    life_path_western: 1,
    expression_western: 8,
    soul_urge_western: 6,
    personality_western: 1,
    birthday_number: 1,
    sun_sign: 'Leo',
    element: 'Fire',
    bio: 'Last son of Krypton, Man of Steel',
    special: 'Invulnerable with endless power'
  },
  {
    id: 'batman',
    name: 'Batman',
    category: 'superhero',
    life_path_western: 8,
    expression_western: 4,
    soul_urge_western: 7,
    personality_western: 8,
    birthday_number: 8,
    sun_sign: 'Scorpio',
    element: 'Water',
    bio: 'Dark Knight of Gotham',
    special: 'Peak human perfection and strategy'
  },
  {
    id: 'wonderwoman',
    name: 'Wonder Woman',
    category: 'superhero',
    life_path_western: 6,
    expression_western: 33,
    soul_urge_western: 11,
    personality_western: 9,
    birthday_number: 6,
    sun_sign: 'Libra',
    element: 'Air',
    bio: 'Amazon princess, warrior of truth',
    special: 'Master Teacher with Amazonian strength'
  },
  {
    id: 'thor',
    name: 'Thor',
    category: 'superhero',
    life_path_western: 1,
    expression_western: 1,
    soul_urge_western: 8,
    personality_western: 1,
    birthday_number: 11,
    sun_sign: 'Aries',
    element: 'Fire',
    bio: 'God of Thunder, wielder of Mjolnir',
    special: 'Triple 1 - Ultimate Leader'
  },
  {
    id: 'spiderman',
    name: 'Spider-Man',
    category: 'superhero',
    life_path_western: 5,
    expression_western: 3,
    soul_urge_western: 5,
    personality_western: 7,
    birthday_number: 5,
    sun_sign: 'Gemini',
    element: 'Air',
    bio: 'Friendly neighborhood hero',
    special: 'Agility and spider-sense'
  },
  {
    id: 'hulk',
    name: 'Hulk',
    category: 'superhero',
    life_path_western: 4,
    expression_western: 8,
    soul_urge_western: 4,
    personality_western: 4,
    birthday_number: 4,
    sun_sign: 'Taurus',
    element: 'Earth',
    bio: 'Strongest Avenger, gamma-powered',
    special: 'Strength increases with anger'
  },
  {
    id: 'captainamerica',
    name: 'Captain America',
    category: 'superhero',
    life_path_western: 6,
    expression_western: 9,
    soul_urge_western: 6,
    personality_western: 1,
    birthday_number: 4,
    sun_sign: 'Cancer',
    element: 'Water',
    bio: 'Super soldier, symbol of freedom',
    special: 'Peak human with unbreakable shield'
  }
];

export const getCharacterById = (id) => {
  return BATTLE_CHARACTERS.find(c => c.id === id);
};

export const getCharactersByCategory = (category) => {
  return BATTLE_CHARACTERS.filter(c => c.category === category);
};

export const getCategoryIcon = (category) => {
  switch(category) {
    case 'biblical': return '📖';
    case 'superhero': return '🦸';
    default: return '⭐';
  }
};

export const getCategoryColor = (category) => {
  switch(category) {
    case 'biblical': return 'from-amber-600 to-yellow-600';
    case 'superhero': return 'from-blue-600 to-red-600';
    default: return 'from-purple-600 to-pink-600';
  }
};