/**
 * Daily Meal Recommendations based on Numerology
 * Provides personalized meal suggestions aligned with Life Path Numbers and Personal Day energy
 * 
 * Features:
 * - Numerology-aligned meal suggestions
 * - Personal day energy considerations
 * - Activity level filtering (on-the-go vs relaxed)
 * - Leftover management and reuse
 * - Shopping list generation
 * 
 * Author: Maher Family Legacy
 * Version: 1.0
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// ============================================================================
// MEAL DATABASE - Organized by Life Path Number Energy
// ============================================================================

const MEAL_DATABASE = {
  // Life Path 1: Leadership, Independence, Initiative - Bold, energizing foods
  1: {
    breakfast: [
      { name: 'Power Protein Bowl', ingredients: ['eggs', 'spinach', 'avocado', 'quinoa', 'hot sauce'], prepTime: 15, portable: true, energyAlignment: 'Bold start for leaders' },
      { name: 'Warrior Smoothie', ingredients: ['banana', 'protein powder', 'almond butter', 'oats', 'cinnamon'], prepTime: 5, portable: true, energyAlignment: 'Quick energy boost' },
      { name: 'Champion\'s Breakfast', ingredients: ['steak', 'eggs', 'sweet potato hash', 'greens'], prepTime: 20, portable: false, energyAlignment: 'Full power breakfast' }
    ],
    lunch: [
      { name: 'Leader\'s Salad', ingredients: ['grilled chicken', 'mixed greens', 'nuts', 'balsamic', 'feta'], prepTime: 15, portable: true, energyAlignment: 'Sustained focus' },
      { name: 'Bold Burrito Bowl', ingredients: ['rice', 'black beans', 'steak', 'salsa', 'guacamole'], prepTime: 20, portable: true, energyAlignment: 'Afternoon power' },
      { name: 'Executive Sandwich', ingredients: ['turkey', 'whole grain bread', 'avocado', 'bacon', 'greens'], prepTime: 10, portable: true, energyAlignment: 'Quick decision fuel' }
    ],
    dinner: [
      { name: 'Pioneer Steak', ingredients: ['ribeye', 'roasted vegetables', 'garlic butter', 'herbs'], prepTime: 30, portable: false, energyAlignment: 'Victory meal' },
      { name: 'Grilled Salmon Power', ingredients: ['salmon', 'asparagus', 'lemon', 'olive oil', 'quinoa'], prepTime: 25, portable: false, energyAlignment: 'Brain food for innovators' },
      { name: 'Dragon Bowl', ingredients: ['teriyaki chicken', 'brown rice', 'stir-fry veggies', 'sesame'], prepTime: 25, portable: false, energyAlignment: 'Fiery energy' }
    ]
  },

  // Life Path 2: Harmony, Partnership, Balance - Gentle, nourishing foods
  2: {
    breakfast: [
      { name: 'Harmony Bowl', ingredients: ['oatmeal', 'berries', 'honey', 'almonds', 'chia seeds'], prepTime: 10, portable: false, energyAlignment: 'Gentle morning balance' },
      { name: 'Peaceful Parfait', ingredients: ['yogurt', 'granola', 'mixed berries', 'honey'], prepTime: 5, portable: true, energyAlignment: 'Calm start' },
      { name: 'Balance Toast', ingredients: ['whole grain bread', 'almond butter', 'banana', 'honey drizzle'], prepTime: 5, portable: true, energyAlignment: 'Sweet harmony' }
    ],
    lunch: [
      { name: 'Diplomat\'s Soup', ingredients: ['vegetable soup', 'whole grain roll', 'butter', 'herbs'], prepTime: 15, portable: false, energyAlignment: 'Comforting balance' },
      { name: 'Partnership Plate', ingredients: ['hummus', 'pita', 'vegetables', 'falafel', 'tahini'], prepTime: 15, portable: true, energyAlignment: 'Collaborative flavors' },
      { name: 'Zen Wrap', ingredients: ['whole wheat wrap', 'turkey', 'cucumber', 'cream cheese', 'sprouts'], prepTime: 10, portable: true, energyAlignment: 'Peaceful lunch' }
    ],
    dinner: [
      { name: 'Harmony Chicken', ingredients: ['baked chicken', 'roasted root vegetables', 'herbs', 'olive oil'], prepTime: 40, portable: false, energyAlignment: 'Balanced nutrition' },
      { name: 'Peace Bowl', ingredients: ['tofu', 'brown rice', 'steamed vegetables', 'miso sauce'], prepTime: 30, portable: false, energyAlignment: 'Gentle evening' },
      { name: 'Comfort Pasta', ingredients: ['whole wheat pasta', 'marinara', 'vegetables', 'parmesan'], prepTime: 25, portable: false, energyAlignment: 'Nurturing warmth' }
    ]
  },

  // Life Path 3: Creativity, Expression, Joy - Colorful, fun foods
  3: {
    breakfast: [
      { name: 'Artist\'s Palette', ingredients: ['rainbow fruit salad', 'yogurt', 'granola', 'coconut'], prepTime: 10, portable: true, energyAlignment: 'Colorful inspiration' },
      { name: 'Creative Crepes', ingredients: ['crepes', 'berries', 'whipped cream', 'chocolate'], prepTime: 20, portable: false, energyAlignment: 'Joyful start' },
      { name: 'Expression Smoothie Bowl', ingredients: ['acai', 'banana', 'granola', 'coconut', 'berries'], prepTime: 10, portable: false, energyAlignment: 'Artistic fuel' }
    ],
    lunch: [
      { name: 'Rainbow Salad', ingredients: ['mixed greens', 'bell peppers', 'carrots', 'beets', 'nuts', 'citrus dressing'], prepTime: 15, portable: true, energyAlignment: 'Vibrant energy' },
      { name: 'Joy Bowl', ingredients: ['quinoa', 'roasted vegetables', 'chickpeas', 'tahini', 'herbs'], prepTime: 20, portable: true, energyAlignment: 'Playful flavors' },
      { name: 'Fiesta Tacos', ingredients: ['corn tortillas', 'fish', 'cabbage slaw', 'lime', 'cilantro'], prepTime: 20, portable: true, energyAlignment: 'Celebration food' }
    ],
    dinner: [
      { name: 'Carnival Stir-Fry', ingredients: ['chicken', 'colorful peppers', 'pineapple', 'jasmine rice', 'teriyaki'], prepTime: 25, portable: false, energyAlignment: 'Festive flavors' },
      { name: 'Artist\'s Pizza', ingredients: ['pizza dough', 'tomato sauce', 'mozzarella', 'vegetables', 'basil'], prepTime: 30, portable: false, energyAlignment: 'Creative expression' },
      { name: 'Mediterranean Feast', ingredients: ['grilled chicken', 'couscous', 'roasted vegetables', 'feta', 'olives'], prepTime: 35, portable: false, energyAlignment: 'Cultural joy' }
    ]
  },

  // Life Path 4: Structure, Foundation, Discipline - Hearty, grounding foods
  4: {
    breakfast: [
      { name: 'Builder\'s Breakfast', ingredients: ['eggs', 'potatoes', 'sausage', 'whole grain toast'], prepTime: 20, portable: false, energyAlignment: 'Foundation fuel' },
      { name: 'Solid Start Oatmeal', ingredients: ['steel cut oats', 'nuts', 'dried fruit', 'brown sugar'], prepTime: 15, portable: false, energyAlignment: 'Steady energy' },
      { name: 'Work Day Burrito', ingredients: ['whole wheat tortilla', 'scrambled eggs', 'beans', 'cheese', 'salsa'], prepTime: 15, portable: true, energyAlignment: 'Practical power' }
    ],
    lunch: [
      { name: 'Foundation Plate', ingredients: ['roast beef', 'mashed potatoes', 'green beans', 'gravy'], prepTime: 25, portable: false, energyAlignment: 'Grounding meal' },
      { name: 'Builder\'s Bowl', ingredients: ['brown rice', 'ground turkey', 'black beans', 'vegetables'], prepTime: 20, portable: true, energyAlignment: 'Structured nutrition' },
      { name: 'Reliable Sandwich', ingredients: ['whole grain bread', 'roast beef', 'cheddar', 'mustard', 'lettuce'], prepTime: 10, portable: true, energyAlignment: 'Dependable fuel' }
    ],
    dinner: [
      { name: 'Hearty Meatloaf', ingredients: ['ground beef', 'oats', 'onions', 'tomato sauce', 'mashed potatoes'], prepTime: 60, portable: false, energyAlignment: 'Classic comfort' },
      { name: 'Root Vegetable Roast', ingredients: ['chicken', 'potatoes', 'carrots', 'parsnips', 'herbs'], prepTime: 50, portable: false, energyAlignment: 'Earthy grounding' },
      { name: 'Shepherd\'s Pie', ingredients: ['ground lamb', 'vegetables', 'mashed potatoes', 'gravy'], prepTime: 55, portable: false, energyAlignment: 'Traditional strength' }
    ]
  },

  // Life Path 5: Freedom, Change, Adventure - Diverse, exciting foods
  5: {
    breakfast: [
      { name: 'Adventure Smoothie', ingredients: ['mango', 'pineapple', 'banana', 'spinach', 'coconut water'], prepTime: 5, portable: true, energyAlignment: 'Quick freedom' },
      { name: 'Globe Trotter Toast', ingredients: ['sourdough', 'avocado', 'everything bagel seasoning', 'egg'], prepTime: 10, portable: true, energyAlignment: 'Trendy fuel' },
      { name: 'Explorer\'s Breakfast', ingredients: ['breakfast burrito', 'chorizo', 'eggs', 'salsa', 'cheese'], prepTime: 15, portable: true, energyAlignment: 'On-the-go energy' }
    ],
    lunch: [
      { name: 'Wanderer\'s Bowl', ingredients: ['mixed grains', 'various proteins', 'international sauces', 'vegetables'], prepTime: 15, portable: true, energyAlignment: 'Variety fuel' },
      { name: 'Street Food Fusion', ingredients: ['banh mi', 'pickled vegetables', 'cilantro', 'sriracha'], prepTime: 15, portable: true, energyAlignment: 'Adventurous flavors' },
      { name: 'Freedom Salad', ingredients: ['mixed greens', 'rotating proteins', 'different dressing daily', 'nuts'], prepTime: 10, portable: true, energyAlignment: 'Never boring' }
    ],
    dinner: [
      { name: 'World Tour Plate', ingredients: ['rotating cuisine', 'exotic spices', 'unique ingredients'], prepTime: 35, portable: false, energyAlignment: 'Travel via food' },
      { name: 'Adventure Curry', ingredients: ['chicken', 'curry sauce', 'rice', 'naan', 'chutney'], prepTime: 40, portable: false, energyAlignment: 'Spicy exploration' },
      { name: 'Nomad\'s Feast', ingredients: ['grilled skewers', 'couscous', 'vegetables', 'yogurt sauce'], prepTime: 30, portable: false, energyAlignment: 'Freedom food' }
    ]
  },

  // Life Path 6: Responsibility, Love, Family - Comforting, nurturing foods
  6: {
    breakfast: [
      { name: 'Family Pancakes', ingredients: ['pancakes', 'maple syrup', 'butter', 'berries'], prepTime: 20, portable: false, energyAlignment: 'Nurturing love' },
      { name: 'Caretaker\'s Bowl', ingredients: ['oatmeal', 'warm milk', 'cinnamon', 'brown sugar', 'raisins'], prepTime: 10, portable: false, energyAlignment: 'Warm comfort' },
      { name: 'Love Muffins', ingredients: ['homemade muffins', 'fruit', 'cream cheese'], prepTime: 30, portable: true, energyAlignment: 'Baked with care' }
    ],
    lunch: [
      { name: 'Nurturer\'s Soup', ingredients: ['chicken noodle soup', 'crackers', 'vegetables'], prepTime: 30, portable: false, energyAlignment: 'Healing warmth' },
      { name: 'Home Plate', ingredients: ['grilled cheese', 'tomato soup', 'pickle'], prepTime: 15, portable: false, energyAlignment: 'Classic comfort' },
      { name: 'Care Package Salad', ingredients: ['chicken', 'greens', 'tomatoes', 'cucumber', 'ranch'], prepTime: 15, portable: true, energyAlignment: 'Loving nutrition' }
    ],
    dinner: [
      { name: 'Family Pot Roast', ingredients: ['chuck roast', 'potatoes', 'carrots', 'onions', 'gravy'], prepTime: 180, portable: false, energyAlignment: 'Sunday dinner love' },
      { name: 'Comfort Casserole', ingredients: ['chicken', 'pasta', 'cream sauce', 'cheese', 'vegetables'], prepTime: 45, portable: false, energyAlignment: 'Home warmth' },
      { name: 'Love Lasagna', ingredients: ['pasta', 'meat sauce', 'ricotta', 'mozzarella', 'herbs'], prepTime: 60, portable: false, energyAlignment: 'Made with love' }
    ]
  },

  // Life Path 7: Spirituality, Wisdom, Introspection - Pure, mindful foods
  7: {
    breakfast: [
      { name: 'Zen Porridge', ingredients: ['quinoa', 'almond milk', 'dates', 'almonds', 'cinnamon'], prepTime: 15, portable: false, energyAlignment: 'Mindful start' },
      { name: 'Meditation Bowl', ingredients: ['chia pudding', 'berries', 'coconut', 'hemp seeds'], prepTime: 5, portable: true, energyAlignment: 'Spiritual fuel' },
      { name: 'Wisdom Toast', ingredients: ['sprouted grain bread', 'almond butter', 'banana', 'flax seeds'], prepTime: 5, portable: true, energyAlignment: 'Brain food' }
    ],
    lunch: [
      { name: 'Seeker\'s Salad', ingredients: ['mixed greens', 'quinoa', 'chickpeas', 'vegetables', 'lemon tahini'], prepTime: 15, portable: true, energyAlignment: 'Pure nutrition' },
      { name: 'Enlightenment Bowl', ingredients: ['brown rice', 'tofu', 'vegetables', 'miso dressing'], prepTime: 20, portable: true, energyAlignment: 'Clean energy' },
      { name: 'Quiet Wrap', ingredients: ['whole wheat wrap', 'hummus', 'vegetables', 'sprouts'], prepTime: 10, portable: true, energyAlignment: 'Simple wisdom' }
    ],
    dinner: [
      { name: 'Mystic Salmon', ingredients: ['wild salmon', 'quinoa', 'steamed vegetables', 'lemon'], prepTime: 25, portable: false, energyAlignment: 'Omega-3 wisdom' },
      { name: 'Temple Bowl', ingredients: ['brown rice', 'lentils', 'roasted vegetables', 'tahini'], prepTime: 35, portable: false, energyAlignment: 'Spiritual nourishment' },
      { name: 'Meditation Stir-Fry', ingredients: ['tofu', 'vegetables', 'brown rice', 'ginger', 'garlic'], prepTime: 25, portable: false, energyAlignment: 'Mindful meal' }
    ]
  },

  // Life Path 8: Achievement, Power, Abundance - Premium, substantial foods
  8: {
    breakfast: [
      { name: 'Executive Breakfast', ingredients: ['smoked salmon', 'cream cheese', 'bagel', 'capers', 'onions'], prepTime: 10, portable: false, energyAlignment: 'Power start' },
      { name: 'Success Scramble', ingredients: ['eggs', 'lobster', 'asparagus', 'hollandaise', 'toast'], prepTime: 20, portable: false, energyAlignment: 'Luxury fuel' },
      { name: 'Abundance Bowl', ingredients: ['acai', 'exotic fruits', 'granola', 'bee pollen', 'coconut'], prepTime: 10, portable: false, energyAlignment: 'Rich energy' }
    ],
    lunch: [
      { name: 'Power Lunch', ingredients: ['prime steak salad', 'blue cheese', 'walnuts', 'balsamic'], prepTime: 20, portable: false, energyAlignment: 'Business fuel' },
      { name: 'Achiever\'s Bowl', ingredients: ['wild rice', 'grilled shrimp', 'avocado', 'mango', 'lime'], prepTime: 25, portable: true, energyAlignment: 'Success food' },
      { name: 'Prosperity Sandwich', ingredients: ['ciabatta', 'prosciutto', 'fresh mozzarella', 'arugula', 'balsamic'], prepTime: 10, portable: true, energyAlignment: 'Quality fuel' }
    ],
    dinner: [
      { name: 'CEO Steak', ingredients: ['filet mignon', 'truffle butter', 'asparagus', 'loaded potato'], prepTime: 35, portable: false, energyAlignment: 'Victory meal' },
      { name: 'Empire Bowl', ingredients: ['lobster tail', 'risotto', 'parmesan', 'white wine', 'herbs'], prepTime: 40, portable: false, energyAlignment: 'Abundant feast' },
      { name: 'Success Salmon', ingredients: ['king salmon', 'fingerling potatoes', 'broccolini', 'lemon butter'], prepTime: 30, portable: false, energyAlignment: 'Premium power' }
    ]
  },

  // Life Path 9: Compassion, Completion, Humanitarianism - Universal, healing foods
  9: {
    breakfast: [
      { name: 'Universal Smoothie', ingredients: ['banana', 'berries', 'spinach', 'flax', 'almond milk'], prepTime: 5, portable: true, energyAlignment: 'Global health' },
      { name: 'Compassion Bowl', ingredients: ['oatmeal', 'walnuts', 'berries', 'maple syrup', 'cinnamon'], prepTime: 10, portable: false, energyAlignment: 'Healing start' },
      { name: 'World Toast', ingredients: ['whole grain bread', 'avocado', 'tomato', 'hemp seeds'], prepTime: 5, portable: true, energyAlignment: 'Universal love' }
    ],
    lunch: [
      { name: 'Humanitarian Bowl', ingredients: ['quinoa', 'beans', 'vegetables', 'tahini', 'herbs'], prepTime: 15, portable: true, energyAlignment: 'Conscious eating' },
      { name: 'Completion Salad', ingredients: ['mixed greens', 'various vegetables', 'nuts', 'seeds', 'vinaigrette'], prepTime: 15, portable: true, energyAlignment: 'Whole nutrition' },
      { name: 'Peace Wrap', ingredients: ['whole wheat wrap', 'falafel', 'hummus', 'vegetables', 'tahini'], prepTime: 15, portable: true, energyAlignment: 'Global flavors' }
    ],
    dinner: [
      { name: 'Universe Bowl', ingredients: ['brown rice', 'roasted vegetables', 'tahini', 'chickpeas', 'herbs'], prepTime: 30, portable: false, energyAlignment: 'Complete nutrition' },
      { name: 'Wisdom Curry', ingredients: ['chickpeas', 'coconut milk', 'curry spices', 'rice', 'naan'], prepTime: 35, portable: false, energyAlignment: 'Ancient wisdom' },
      { name: 'Healing Stew', ingredients: ['lentils', 'vegetables', 'herbs', 'whole grain bread'], prepTime: 45, portable: false, energyAlignment: 'Restorative power' }
    ]
  },

  // Life Path 11: Intuition, Inspiration, Enlightenment - Light, spiritual foods
  11: {
    breakfast: [
      { name: 'Master Smoothie', ingredients: ['blueberries', 'banana', 'spirulina', 'chia', 'almond milk'], prepTime: 5, portable: true, energyAlignment: 'Spiritual awakening' },
      { name: 'Intuition Bowl', ingredients: ['acai', 'dragon fruit', 'goji berries', 'coconut', 'cacao'], prepTime: 10, portable: false, energyAlignment: 'Third eye fuel' },
      { name: 'Light Toast', ingredients: ['sprouted bread', 'honey', 'bee pollen', 'blueberries'], prepTime: 5, portable: true, energyAlignment: 'Divine energy' }
    ],
    lunch: [
      { name: 'Enlightenment Salad', ingredients: ['mixed greens', 'quinoa', 'avocado', 'seeds', 'lemon'], prepTime: 15, portable: true, energyAlignment: 'Clear energy' },
      { name: 'Vision Bowl', ingredients: ['brown rice', 'purple cabbage', 'edamame', 'carrots', 'ginger dressing'], prepTime: 15, portable: true, energyAlignment: 'Clarity food' },
      { name: 'Master Wrap', ingredients: ['collard green wrap', 'hummus', 'vegetables', 'sprouts'], prepTime: 10, portable: true, energyAlignment: 'Pure fuel' }
    ],
    dinner: [
      { name: 'Divine Salmon', ingredients: ['wild salmon', 'asparagus', 'quinoa', 'lemon', 'dill'], prepTime: 25, portable: false, energyAlignment: 'Intuitive nourishment' },
      { name: 'Master Bowl', ingredients: ['purple rice', 'tofu', 'vegetables', 'sesame', 'miso'], prepTime: 30, portable: false, energyAlignment: 'Higher vibration' },
      { name: 'Inspiration Stir-Fry', ingredients: ['vegetables', 'tempeh', 'brown rice', 'ginger', 'tamari'], prepTime: 25, portable: false, energyAlignment: 'Creative flow' }
    ]
  },

  // Life Path 22: Master Builder - Substantial, transformative foods
  22: {
    breakfast: [
      { name: 'Builder\'s Power Bowl', ingredients: ['eggs', 'sweet potato', 'spinach', 'avocado', 'nuts'], prepTime: 20, portable: false, energyAlignment: 'Foundation energy' },
      { name: 'Master Meal', ingredients: ['protein pancakes', 'berries', 'almond butter', 'maple syrup'], prepTime: 15, portable: false, energyAlignment: 'Building blocks' },
      { name: 'Architect\'s Breakfast', ingredients: ['overnight oats', 'chia', 'protein', 'berries', 'nuts'], prepTime: 5, portable: true, energyAlignment: 'Structured fuel' }
    ],
    lunch: [
      { name: 'Master Builder Bowl', ingredients: ['quinoa', 'chicken', 'vegetables', 'avocado', 'tahini'], prepTime: 20, portable: true, energyAlignment: 'Manifestation fuel' },
      { name: 'Transform Plate', ingredients: ['salmon', 'brown rice', 'roasted vegetables', 'herbs'], prepTime: 25, portable: false, energyAlignment: 'Power lunch' },
      { name: 'Visionary Wrap', ingredients: ['whole wheat wrap', 'turkey', 'vegetables', 'hummus', 'sprouts'], prepTime: 10, portable: true, energyAlignment: 'Quick power' }
    ],
    dinner: [
      { name: 'Empire Steak', ingredients: ['ribeye', 'roasted vegetables', 'potatoes', 'compound butter'], prepTime: 35, portable: false, energyAlignment: 'Victory feast' },
      { name: 'Master Feast', ingredients: ['lamb chops', 'couscous', 'roasted vegetables', 'mint sauce'], prepTime: 40, portable: false, energyAlignment: 'Grand vision' },
      { name: 'Builder\'s Bounty', ingredients: ['chicken', 'quinoa', 'roasted root vegetables', 'gravy'], prepTime: 45, portable: false, energyAlignment: 'Grounding power' }
    ]
  },

  // Life Path 33: Master Teacher - Healing, pure foods
  33: {
    breakfast: [
      { name: 'Healer\'s Smoothie', ingredients: ['mango', 'turmeric', 'ginger', 'coconut water', 'chia'], prepTime: 5, portable: true, energyAlignment: 'Healing vibration' },
      { name: 'Teacher\'s Bowl', ingredients: ['quinoa porridge', 'berries', 'honey', 'almonds', 'cinnamon'], prepTime: 15, portable: false, energyAlignment: 'Nurturing wisdom' },
      { name: 'Compassion Toast', ingredients: ['whole grain bread', 'almond butter', 'banana', 'honey', 'cacao nibs'], prepTime: 5, portable: true, energyAlignment: 'Heart food' }
    ],
    lunch: [
      { name: 'Master Teacher Salad', ingredients: ['mixed greens', 'chickpeas', 'vegetables', 'tahini', 'lemon'], prepTime: 15, portable: true, energyAlignment: 'Pure energy' },
      { name: 'Healing Bowl', ingredients: ['brown rice', 'lentils', 'steamed vegetables', 'turmeric sauce'], prepTime: 25, portable: true, energyAlignment: 'Restorative power' },
      { name: 'Love Wrap', ingredients: ['whole wheat wrap', 'hummus', 'roasted vegetables', 'sprouts', 'tahini'], prepTime: 15, portable: true, energyAlignment: 'Compassionate fuel' }
    ],
    dinner: [
      { name: 'Divine Feast', ingredients: ['baked salmon', 'quinoa', 'roasted vegetables', 'herbs', 'lemon'], prepTime: 30, portable: false, energyAlignment: 'Healing energy' },
      { name: 'Master Meal', ingredients: ['chicken', 'sweet potato', 'greens', 'tahini', 'pomegranate'], prepTime: 35, portable: false, energyAlignment: 'Teacher\'s nourishment' },
      { name: 'Compassion Curry', ingredients: ['chickpeas', 'spinach', 'coconut milk', 'curry', 'rice'], prepTime: 30, portable: false, energyAlignment: 'Universal love' }
    ]
  }
};

// ============================================================================
// PERSONAL DAY ENERGY INFLUENCE
// ============================================================================

// ============================================================================
// PERSONAL DAY ENERGY INFLUENCE
// ============================================================================

const PERSONAL_DAY_INFLUENCE = {
  1: { energy: 'Initiative', mealAdvice: 'Bold flavors, high protein for action', preferLeftovers: false },
  2: { energy: 'Balance', mealAdvice: 'Balanced meals, nothing too extreme', preferLeftovers: true },
  3: { energy: 'Creativity', mealAdvice: 'Colorful, fun presentation', preferLeftovers: false },
  4: { energy: 'Grounding', mealAdvice: 'Hearty, substantial meals', preferLeftovers: true },
  5: { energy: 'Change', mealAdvice: 'Try something new, variety', preferLeftovers: false },
  6: { energy: 'Nurturing', mealAdvice: 'Comforting, home-cooked meals', preferLeftovers: true },
  7: { energy: 'Reflection', mealAdvice: 'Light, pure, mindful eating', preferLeftovers: false },
  8: { energy: 'Achievement', mealAdvice: 'Premium, satisfying meals', preferLeftovers: false },
  9: { energy: 'Completion', mealAdvice: 'Use up leftovers, complete meals', preferLeftovers: true },
  11: { energy: 'Inspiration', mealAdvice: 'Light, high-vibration foods', preferLeftovers: false },
  22: { energy: 'Manifestation', mealAdvice: 'Substantial, building foods', preferLeftovers: false },
  33: { energy: 'Healing', mealAdvice: 'Pure, healing, nurturing foods', preferLeftovers: true }
};

// ============================================================================
// MEAL RECOMMENDATION ENGINE
// ============================================================================

function getMealRecommendations(lifePath, personalDay, activityLevel = 'mixed', existingLeftovers = []) {
  // Normalize life path for master numbers
  // Master numbers (11, 22, 33) use their own meal sets
  // Other numbers > 9 are reduced (e.g., 10 becomes 1)
  const mealLifePath = [11, 22, 33].includes(lifePath) ? lifePath : (lifePath > 9 ? lifePath % 9 || 9 : lifePath);
  
  // Get meals for life path
  const lifeMeals = MEAL_DATABASE[mealLifePath] || MEAL_DATABASE[1];
  const dayInfluence = PERSONAL_DAY_INFLUENCE[personalDay] || PERSONAL_DAY_INFLUENCE[1];
  
  // Filter by activity level
  const filterByActivity = (meal) => {
    if (activityLevel === 'on-the-go') return meal.portable === true;
    if (activityLevel === 'relaxed') return true; // All meals work for relaxed days
    return true; // Mixed accepts all
  };
  
  const recommendations = {
    breakfast: lifeMeals.breakfast.filter(filterByActivity),
    lunch: lifeMeals.lunch.filter(filterByActivity),
    dinner: lifeMeals.dinner.filter(filterByActivity)
  };
  
  // Leftover suggestions (if personal day favors leftovers)
  const leftoverSuggestions = dayInfluence.preferLeftovers && existingLeftovers.length > 0
    ? generateLeftoverIdeas(existingLeftovers, personalDay)
    : [];
  
  return {
    lifePath,
    personalDay,
    dayEnergy: dayInfluence.energy,
    mealAdvice: dayInfluence.mealAdvice,
    recommendations,
    leftoverSuggestions,
    shoppingList: generateShoppingList(recommendations.breakfast[0], recommendations.lunch[0], recommendations.dinner[0])
  };
}

function generateLeftoverIdeas(leftovers, personalDay) {
  const ideas = [];
  
  // Generic leftover transformation ideas based on personal day
  const transformations = {
    2: 'Combine leftovers into a balanced bowl',
    4: 'Turn into a hearty casserole or hash',
    6: 'Make a comforting soup or stew',
    9: 'Complete the cycle - finish all leftovers today'
  };
  
  if (transformations[personalDay]) {
    ideas.push({
      idea: transformations[personalDay],
      ingredients: leftovers,
      energyAlignment: `Personal Day ${personalDay} favors practical use of resources`
    });
  }
  
  return ideas;
}

function generateShoppingList(breakfast, lunch, dinner) {
  const allIngredients = new Set();
  
  [breakfast, lunch, dinner].forEach(meal => {
    if (meal && meal.ingredients) {
      meal.ingredients.forEach(ing => allIngredients.add(ing));
    }
  });
  
  return Array.from(allIngredients);
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { 
      lifePath, 
      personalDay, 
      activityLevel = 'mixed',
      existingLeftovers = []
    } = body;
    
    console.log('Meal recommendations request:', { lifePath, personalDay, activityLevel });
    
    if (!lifePath || !personalDay) {
      return Response.json({ 
        error: 'Missing required parameters: lifePath and personalDay are required',
        received: { lifePath, personalDay }
      }, { status: 400 });
    }
    
    const result = getMealRecommendations(
      lifePath,
      personalDay,
      activityLevel,
      existingLeftovers
    );
    
    console.log('Meal recommendations result:', { 
      breakfastCount: result.recommendations.breakfast.length,
      lunchCount: result.recommendations.lunch.length,
      dinnerCount: result.recommendations.dinner.length
    });
    
    return Response.json({ success: true, data: result });
    
  } catch (error) {
    console.error('Meal recommendations error:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});