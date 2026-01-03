import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sparkles, Repeat, Calendar, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AIFeaturesPanel({ userMember, todayCalc, activityLevel }) {
  const [aiLoading, setAiLoading] = useState(false);
  const [customMeal, setCustomMeal] = useState(null);
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [preferences, setPreferences] = useState({ cuisine: '', protein: '', mealType: 'dinner' });
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [availableIngredients, setAvailableIngredients] = useState('');
  const [substitutionResult, setSubstitutionResult] = useState(null);
  const [ingredientToSubstitute, setIngredientToSubstitute] = useState('');

  const handleGenerateCustomMeal = async () => {
    setAiLoading(true);
    setCustomMeal(null);
    try {
      const response = await base44.functions.invoke('mealRecommendations', {
        action: 'generateCustomMeal',
        lifePath: userMember.life_path_western,
        personalDay: todayCalc?.personalDay || todayCalc?.universalDay,
        preferences,
        dietaryRestrictions,
        availableIngredients: availableIngredients.split(',').map(i => i.trim()).filter(Boolean)
      });
      if (response.data?.success) setCustomMeal(response.data.data);
    } catch (err) {
      console.error('Custom meal generation failed:', err);
    }
    setAiLoading(false);
  };

  const handleSubstituteIngredient = async () => {
    setAiLoading(true);
    setSubstitutionResult(null);
    try {
      const response = await base44.functions.invoke('mealRecommendations', {
        action: 'substituteIngredient',
        ingredientToSubstitute,
        dietaryRestrictions
      });
      if (response.data?.success) setSubstitutionResult(response.data.data);
    } catch (err) {
      console.error('Substitution failed:', err);
    }
    setAiLoading(false);
  };

  const handleGenerateWeeklyPlan = async () => {
    setAiLoading(true);
    setWeeklyPlan(null);
    try {
      const response = await base44.functions.invoke('mealRecommendations', {
        action: 'weeklyPlan',
        lifePath: userMember.life_path_western,
        activityLevel,
        preferences,
        dietaryRestrictions
      });
      if (response.data?.success) setWeeklyPlan(response.data.data);
    } catch (err) {
      console.error('Weekly plan generation failed:', err);
    }
    setAiLoading(false);
  };

  const toggleDietaryRestriction = (restriction) => {
    setDietaryRestrictions(prev =>
      prev.includes(restriction) ? prev.filter(r => r !== restriction) : [...prev, restriction]
    );
  };

  return (
    <div className="space-y-6">
      {/* Custom Meal Generator */}
      <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm border-purple-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-300" />
            AI Custom Meal Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-3">
            <Input placeholder="Cuisine (e.g., Italian)" value={preferences.cuisine} onChange={(e) => setPreferences({...preferences, cuisine: e.target.value})} className="bg-white/10 border-white/20 text-white placeholder:text-gray-500" />
            <Input placeholder="Protein (e.g., chicken)" value={preferences.protein} onChange={(e) => setPreferences({...preferences, protein: e.target.value})} className="bg-white/10 border-white/20 text-white placeholder:text-gray-500" />
            <select value={preferences.mealType} onChange={(e) => setPreferences({...preferences, mealType: e.target.value})} className="bg-white/10 border border-white/20 text-white rounded px-3 py-2">
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>
          <Input placeholder="Available ingredients (comma-separated)" value={availableIngredients} onChange={(e) => setAvailableIngredients(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-gray-500" />
          <div className="flex flex-wrap gap-2">
            {['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'low-carb'].map(diet => (
              <Button key={diet} size="sm" variant={dietaryRestrictions.includes(diet) ? 'default' : 'outline'} onClick={() => toggleDietaryRestriction(diet)} className={dietaryRestrictions.includes(diet) ? 'bg-purple-600 text-white' : 'bg-white/10 border-white/30 text-white hover:bg-white/20'}>
                {diet}
              </Button>
            ))}
          </div>
          <Button onClick={handleGenerateCustomMeal} disabled={aiLoading} className="w-full bg-purple-600 hover:bg-purple-700">
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Generate Custom Meal
          </Button>
          {customMeal && (
            <div className="mt-4 p-4 bg-black/30 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-2">{customMeal.name}</h3>
              <p className="text-amber-300 text-sm mb-3">{customMeal.energyAlignment}</p>
              <div className="mb-3">
                <p className="text-white font-medium mb-1">Ingredients:</p>
                <ul className="text-gray-300 text-sm list-disc list-inside">{customMeal.ingredients?.map((ing, i) => <li key={i}>{ing}</li>)}</ul>
              </div>
              <div>
                <p className="text-white font-medium mb-1">Steps:</p>
                <ol className="text-gray-300 text-sm list-decimal list-inside space-y-1">{customMeal.steps?.map((step, i) => <li key={i}>{step}</li>)}</ol>
              </div>
              <p className="text-gray-400 text-xs mt-2">⏱ {customMeal.prepTime} minutes</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ingredient Substitution */}
      <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-sm border-blue-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Repeat className="w-5 h-5 text-blue-300" />
            Ingredient Substitution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Ingredient to substitute (e.g., butter)" value={ingredientToSubstitute} onChange={(e) => setIngredientToSubstitute(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-gray-500" />
          <Button onClick={handleSubstituteIngredient} disabled={aiLoading || !ingredientToSubstitute} className="w-full bg-blue-600 hover:bg-blue-700">
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Find Substitutions
          </Button>
          {substitutionResult?.substitutions && (
            <div className="space-y-2">
              {substitutionResult.substitutions.map((sub, i) => (
                <div key={i} className="p-3 bg-black/30 rounded-lg">
                  <p className="text-white font-medium">{sub.ingredient}</p>
                  <p className="text-gray-300 text-sm">{sub.reason}</p>
                  <p className="text-blue-300 text-xs mt-1">{sub.adjustments}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Meal Plan */}
      <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-sm border-green-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-300" />
            AI Weekly Meal Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGenerateWeeklyPlan} disabled={aiLoading} className="w-full bg-green-600 hover:bg-green-700">
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Generate 7-Day Plan
          </Button>
          {weeklyPlan && (
            <div className="space-y-4">
              {weeklyPlan.weeklyPlan?.map((day, i) => (
                <div key={i} className="p-4 bg-black/30 rounded-lg">
                  <h3 className="text-white font-bold mb-1">{day.day} - Day {day.dayNumber}</h3>
                  <p className="text-green-300 text-sm mb-2">{day.energyFocus}</p>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-300"><span className="text-white">🍳 Breakfast:</span> {day.breakfast}</p>
                    <p className="text-gray-300"><span className="text-white">🥗 Lunch:</span> {day.lunch}</p>
                    <p className="text-gray-300"><span className="text-white">🍽️ Dinner:</span> {day.dinner}</p>
                  </div>
                </div>
              ))}
              {weeklyPlan.shoppingList && (
                <div className="p-4 bg-amber-900/30 rounded-lg">
                  <h3 className="text-white font-bold mb-2">🛒 Shopping List</h3>
                  <ul className="text-gray-300 text-sm list-disc list-inside grid md:grid-cols-2 gap-1">
                    {weeklyPlan.shoppingList.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              )}
              {weeklyPlan.prepTips && (
                <div className="p-4 bg-blue-900/30 rounded-lg">
                  <h3 className="text-white font-bold mb-2">💡 Meal Prep Tips</h3>
                  <ul className="text-gray-300 text-sm list-disc list-inside space-y-1">
                    {weeklyPlan.prepTips.map((tip, i) => <li key={i}>{tip}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}