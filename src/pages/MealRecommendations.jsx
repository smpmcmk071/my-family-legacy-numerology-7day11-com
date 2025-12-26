import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { 
  Utensils, Sun, ChefHat, ShoppingCart, Loader2, 
  Zap, Home, Coffee, Clock, CheckCircle2, AlertCircle,
  Sparkles, RefreshCw, Calendar
} from 'lucide-react';
import { createPageUrl } from '../utils';
import NumberBadge from '../components/legacy/NumberBadge';

// Get current date in EST timezone
const getESTDate = () => {
  const now = new Date();
  const year = now.toLocaleString('en-US', { timeZone: 'America/New_York', year: 'numeric' });
  const month = now.toLocaleString('en-US', { timeZone: 'America/New_York', month: '2-digit' });
  const day = now.toLocaleString('en-US', { timeZone: 'America/New_York', day: '2-digit' });
  return `${year}-${month}-${day}`;
};

export default function MealRecommendations() {
  const [userMember, setUserMember] = useState(null);
  const [todayCalc, setTodayCalc] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activityLevel, setActivityLevel] = useState('mixed'); // 'relaxed', 'on-the-go', 'mixed'
  const [preparedMeals, setPreparedMeals] = useState(new Set());

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (userMember && todayCalc) {
      loadMealRecommendations();
    }
  }, [userMember, todayCalc, activityLevel]);

  const loadUserData = async () => {
    setIsLoading(true);
    const user = await base44.auth.me();
    
    // Find member by email
    let members = await base44.entities.FamilyMember.filter({ email: user.email });
    let selfMember = members.find(m => m.relationship === 'self') || members[0];
    
    if (!selfMember) {
      const createdMembers = await base44.entities.FamilyMember.filter({ created_by: user.email });
      selfMember = createdMembers.find(m => m.relationship === 'self') || createdMembers[0];
    }
    
    if (selfMember) {
      setUserMember(selfMember);
      
      // Get today's numbers
      const today = getESTDate();
      const response = await base44.functions.invoke('calculateNumerology', {
        type: 'dayNumbers',
        date: today,
        lifePath: selfMember.life_path_western,
        birthMonth: new Date(selfMember.birth_date).getMonth() + 1,
        birthDay: new Date(selfMember.birth_date).getDate()
      });
      
      if (response.data?.success) {
        setTodayCalc(response.data.data);
      }
    }
    setIsLoading(false);
  };

  const loadMealRecommendations = async () => {
    if (!userMember || !todayCalc) return;
    
    try {
      const response = await base44.functions.invoke('mealRecommendations', {
        lifePath: userMember.life_path_western,
        personalDay: todayCalc.personalDay || todayCalc.universalDay,
        activityLevel,
        existingLeftovers: []
      });
      
      if (response.data?.success) {
        setMealPlan(response.data.data);
      }
    } catch (error) {
      console.error('Error loading meal recommendations:', error);
    }
  };

  const toggleMealPrepared = (mealType) => {
    const newPrepared = new Set(preparedMeals);
    if (newPrepared.has(mealType)) {
      newPrepared.delete(mealType);
    } else {
      newPrepared.add(mealType);
    }
    setPreparedMeals(newPrepared);
  };

  const renderMealCard = (meal, mealType) => {
    if (!meal) return null;
    
    const isPrepared = preparedMeals.has(mealType);
    
    return (
      <Card className={`bg-white/10 backdrop-blur-sm border-white/20 transition-all hover:scale-[1.02] ${
        isPrepared ? 'opacity-60' : ''
      }`}>
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              {mealType === 'breakfast' && <Coffee className="w-5 h-5 text-amber-400" />}
              {mealType === 'lunch' && <Sun className="w-5 h-5 text-yellow-400" />}
              {mealType === 'dinner' && <ChefHat className="w-5 h-5 text-orange-400" />}
              <span className="capitalize">{mealType}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleMealPrepared(mealType)}
              className={isPrepared ? 'text-green-400' : 'text-gray-400'}
            >
              <CheckCircle2 className={`w-5 h-5 ${isPrepared ? 'fill-current' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{meal.name}</h3>
              <p className="text-sm text-purple-300 italic mb-3">
                <Sparkles className="w-4 h-4 inline mr-1" />
                {meal.energyAlignment}
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-400 font-medium">Ingredients:</p>
              <div className="flex flex-wrap gap-2">
                {meal.ingredients.map((ing, i) => (
                  <span 
                    key={i} 
                    className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{meal.prepTime} min</span>
              </div>
              {meal.portable && (
                <div className="flex items-center gap-1 text-green-400">
                  <Zap className="w-4 h-4" />
                  <span>Portable</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  if (!userMember) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-amber-500/20 backdrop-blur-sm border-amber-500/30 mb-6">
            <CardContent className="py-6">
              <div className="flex items-start gap-4">
                <Utensils className="w-10 h-10 text-amber-400 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Create Your Profile First</h2>
                  <p className="text-gray-300 mb-4">
                    To receive personalized meal recommendations based on your numerology, 
                    please create your profile first.
                  </p>
                  <Button 
                    onClick={() => window.location.href = createPageUrl('AddFamilyMember') + '?setupSelf=true'}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    Create My Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Utensils className="w-8 h-8 text-amber-400" />
            Daily Meal Recommendations
          </h1>
          <p className="text-gray-300">Numerology-aligned meals for your personal energy</p>
        </div>

        {/* Today's Energy Summary */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-400" />
              Today's Energy - {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg border border-amber-500/30 text-center">
                <p className="text-xs text-amber-300 mb-2">Your Life Path</p>
                <NumberBadge number={userMember.life_path_western} size="lg" />
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30 text-center">
                <p className="text-xs text-purple-300 mb-2">Personal Day</p>
                <NumberBadge number={todayCalc?.personalDay || todayCalc?.universalDay} size="lg" />
              </div>
              <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30">
                <p className="text-xs text-cyan-300 mb-2">Day Energy</p>
                <p className="text-white font-bold text-lg">{mealPlan?.dayEnergy}</p>
                <p className="text-cyan-200 text-xs mt-1">{mealPlan?.mealAdvice}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Level Selection */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Select Your Activity Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant={activityLevel === 'relaxed' ? 'default' : 'outline'}
                onClick={() => setActivityLevel('relaxed')}
                className={`h-auto py-4 flex flex-col items-center gap-2 ${
                  activityLevel === 'relaxed' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
              >
                <Home className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Relaxed Day</p>
                  <p className="text-xs opacity-80">Sit-down meals</p>
                </div>
              </Button>
              
              <Button
                variant={activityLevel === 'on-the-go' ? 'default' : 'outline'}
                onClick={() => setActivityLevel('on-the-go')}
                className={`h-auto py-4 flex flex-col items-center gap-2 ${
                  activityLevel === 'on-the-go' 
                    ? 'bg-orange-600 hover:bg-orange-700' 
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
              >
                <Zap className="w-6 h-6" />
                <div>
                  <p className="font-semibold">On-the-Go</p>
                  <p className="text-xs opacity-80">Portable meals</p>
                </div>
              </Button>
              
              <Button
                variant={activityLevel === 'mixed' ? 'default' : 'outline'}
                onClick={() => setActivityLevel('mixed')}
                className={`h-auto py-4 flex flex-col items-center gap-2 ${
                  activityLevel === 'mixed' 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
              >
                <RefreshCw className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Mixed Day</p>
                  <p className="text-xs opacity-80">Flexible options</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Meal Plans */}
        {mealPlan && (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {renderMealCard(mealPlan.recommendations.breakfast[0], 'breakfast')}
              {renderMealCard(mealPlan.recommendations.lunch[0], 'lunch')}
              {renderMealCard(mealPlan.recommendations.dinner[0], 'dinner')}
            </div>

            {/* Shopping List */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-green-400" />
                  Today's Shopping List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {mealPlan.shoppingList.map((item, i) => (
                    <div 
                      key={i}
                      className="p-3 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      <p className="text-white text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Leftover Suggestions */}
            {mealPlan.leftoverSuggestions.length > 0 && (
              <Card className="bg-amber-500/20 backdrop-blur-sm border-amber-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    Leftover Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mealPlan.leftoverSuggestions.map((suggestion, i) => (
                      <div key={i} className="p-4 bg-white/10 rounded-lg">
                        <p className="text-white font-semibold mb-2">{suggestion.idea}</p>
                        <p className="text-sm text-amber-300 italic">{suggestion.energyAlignment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => window.location.href = createPageUrl('PersonalDashboard')}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
