# Daily Meal Recommendations Feature

## Overview
The Daily Meal Recommendations feature provides personalized meal suggestions based on the user's numerology profile, specifically their Life Path Number and Personal Day calculations.

## Features

### Numerology-Aligned Meals
- **Life Path Number Integration**: Each Life Path (1-9, 11, 22, 33) has a curated meal database with breakfast, lunch, and dinner options
- **Personal Day Influence**: Daily recommendations adjust based on the personal day energy (e.g., grounding days favor hearty meals, change days favor variety)
- **Energy Alignments**: Each meal includes an explanation of how it aligns with the user's numerological energy

### Activity Level Filtering
Three activity modes to match your day:
- **Relaxed Day**: All meal options available, including sit-down meals
- **On-the-Go**: Only portable meal options that can be eaten while mobile
- **Mixed Day**: Flexible options combining both types

### Meal Database Structure
Each Life Path Number has meals organized by:
- Meal type (breakfast, lunch, dinner)
- Ingredients list
- Preparation time
- Portability indicator
- Energy alignment description

### Smart Features
- **Shopping List Generation**: Automatically creates a shopping list from the day's recommended meals
- **Leftover Suggestions**: On practical days (2, 4, 6, 9), the system suggests leftover reuse ideas
- **Meal Tracking**: Mark meals as prepared to track your progress through the day

## Life Path Meal Themes

### Life Path 1: Leadership Energy
- Bold, energizing foods
- High protein for action and initiative
- Examples: Power Protein Bowl, Bold Burrito Bowl, Pioneer Steak

### Life Path 2: Harmony Energy
- Gentle, nourishing foods
- Balanced meals with nothing extreme
- Examples: Harmony Bowl, Partnership Plate, Peace Bowl

### Life Path 3: Creative Expression
- Colorful, fun foods
- Artistic presentation and variety
- Examples: Artist's Palette, Rainbow Salad, Carnival Stir-Fry

### Life Path 4: Structure Energy
- Hearty, grounding foods
- Traditional, substantial meals
- Examples: Builder's Breakfast, Foundation Plate, Hearty Meatloaf

### Life Path 5: Freedom Energy
- Diverse, exciting foods
- International flavors and variety
- Examples: Adventure Smoothie, Street Food Fusion, World Tour Plate

### Life Path 6: Nurturing Energy
- Comforting, nurturing foods
- Home-cooked, family-style meals
- Examples: Family Pancakes, Nurturer's Soup, Family Pot Roast

### Life Path 7: Spiritual Wisdom
- Pure, mindful foods
- Light, clean eating
- Examples: Zen Porridge, Seeker's Salad, Mystic Salmon

### Life Path 8: Achievement Energy
- Premium, substantial foods
- Luxury ingredients and preparation
- Examples: Executive Breakfast, Power Lunch, CEO Steak

### Life Path 9: Humanitarian Energy
- Universal, healing foods
- Conscious, whole nutrition
- Examples: Universal Smoothie, Humanitarian Bowl, Universe Bowl

### Life Path 11: Intuition Energy
- Light, spiritual foods
- High-vibration ingredients
- Examples: Master Smoothie, Enlightenment Salad, Divine Salmon

### Life Path 22: Master Builder
- Substantial, transformative foods
- Building and grounding energy
- Examples: Builder's Power Bowl, Master Builder Bowl, Empire Steak

### Life Path 33: Master Teacher
- Healing, pure foods
- Compassionate, nurturing meals
- Examples: Healer's Smoothie, Master Teacher Salad, Divine Feast

## Technical Implementation

### Backend Function
**File**: `/functions/mealRecommendations.ts`

The backend function accepts:
- `lifePath`: User's Life Path Number (1-9, 11, 22, 33)
- `personalDay`: Current personal day number
- `activityLevel`: 'relaxed', 'on-the-go', or 'mixed'
- `existingLeftovers`: Array of leftover ingredients (optional)

Returns:
- Recommended meals for breakfast, lunch, and dinner
- Day energy description
- Meal advice based on personal day
- Shopping list
- Leftover suggestions (when applicable)

### Frontend Page
**File**: `/src/pages/MealRecommendations.jsx`

Features:
- User profile integration
- Activity level selection buttons
- Meal cards with ingredients, prep time, and energy alignment
- Shopping list display
- Meal preparation tracking
- Responsive design for mobile and desktop

### Integration Points
- **PersonalDashboard**: Navigation card added to access meal recommendations
- **pages.config.js**: Route registered as 'MealRecommendations'
- **calculateNumerology function**: Provides personal day calculations

## User Flow

1. User navigates to Personal Dashboard
2. Clicks on "Daily Meal Recommendations" card
3. System loads user's Life Path and calculates Personal Day
4. User selects activity level (Relaxed/On-the-Go/Mixed)
5. System displays three meal recommendations (breakfast, lunch, dinner)
6. User views ingredients, prep times, and energy alignments
7. Shopping list auto-generates from selected meals
8. User can mark meals as prepared throughout the day

## Future Enhancements

Potential additions:
- Database persistence for meal history
- Dietary restriction filters (vegetarian, vegan, gluten-free, etc.)
- Custom meal additions by users
- Weekly meal planning
- Nutritional information
- Recipe instructions
- Leftover tracking with expiry dates
- Meal prep scheduling
- Favorite meals list
- Social sharing of meal plans

## API Usage Example

```javascript
const response = await base44.functions.invoke('mealRecommendations', {
  lifePath: 7,
  personalDay: 5,
  activityLevel: 'on-the-go',
  existingLeftovers: []
});

// Returns:
{
  success: true,
  data: {
    lifePath: 7,
    personalDay: 5,
    dayEnergy: 'Change',
    mealAdvice: 'Try something new, variety',
    recommendations: {
      breakfast: [...],
      lunch: [...],
      dinner: [...]
    },
    leftoverSuggestions: [],
    shoppingList: [...]
  }
}
```

## Numerological Philosophy

The meal recommendations are based on the principle that food carries vibrational energy that can support or hinder our numerological paths. By aligning our nutrition with our Life Path energy and daily cycles, we create harmony between body, mind, and spirit.

- **Grounding numbers (4, 8, 22)**: Need substantial, earthy foods
- **Spiritual numbers (7, 9, 11, 33)**: Benefit from light, pure foods
- **Creative numbers (3, 5)**: Thrive with variety and color
- **Nurturing numbers (2, 6)**: Resonate with comforting, home-cooked meals
- **Action numbers (1)**: Require energizing, bold flavors

## Notes

- All meals include whole, nutritious ingredients
- Preparation times are estimates and may vary
- Portable designation helps with busy schedules
- Energy alignments provide spiritual context
- Shopping lists help with meal planning efficiency
