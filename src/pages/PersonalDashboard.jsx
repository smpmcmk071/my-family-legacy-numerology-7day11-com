import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { Sparkles, Sun, Moon, Calendar, TrendingUp, Heart, Briefcase, Users, Loader2, ChevronLeft, ChevronRight, User, X, AlertTriangle, Star, Utensils } from 'lucide-react';
import { createPageUrl } from '../utils';
import NumberBadge from '../components/legacy/NumberBadge';
import DailySongs from '../components/legacy/DailySongs';
import DailyAstrologySummary from '../components/dashboard/DailyAstrologySummary';

const NUMBER_MEANINGS = {
  1: { title: 'The Leader', keywords: ['independence', 'innovation', 'ambition'], advice: 'Take initiative today. Your leadership energy is strong.' },
  2: { title: 'The Diplomat', keywords: ['cooperation', 'balance', 'sensitivity'], advice: 'Focus on partnerships and collaboration. Listen more than you speak.' },
  3: { title: 'The Creator', keywords: ['expression', 'joy', 'creativity'], advice: 'Express yourself freely. Creative projects are favored.' },
  4: { title: 'The Builder', keywords: ['stability', 'discipline', 'order'], advice: 'Build solid foundations. Organization brings success.' },
  5: { title: 'The Free Spirit', keywords: ['change', 'freedom', 'adventure'], advice: 'Embrace change and new experiences. Flexibility is key.' },
  6: { title: 'The Nurturer', keywords: ['responsibility', 'love', 'family'], advice: 'Focus on home and loved ones. Service to others brings fulfillment.' },
  7: { title: 'The Seeker', keywords: ['wisdom', 'introspection', 'spirituality'], advice: 'Take time for reflection. Trust your inner guidance.' },
  8: { title: 'The Achiever', keywords: ['abundance', 'power', 'success'], advice: 'Focus on career and finances. Manifestation energy is high.' },
  9: { title: 'The Humanitarian', keywords: ['compassion', 'completion', 'wisdom'], advice: 'Let go of what no longer serves. Give generously to others.' },
  11: { title: 'The Visionary', keywords: ['intuition', 'inspiration', 'enlightenment'], advice: 'Trust your intuition. You have heightened spiritual awareness.' },
  22: { title: 'The Master Builder', keywords: ['manifestation', 'vision', 'legacy'], advice: 'Think big. You can turn dreams into reality today.' },
  33: { title: 'The Master Teacher', keywords: ['healing', 'blessing', 'service'], advice: 'Share your wisdom. Your words have power to heal.' }
};

const COMPATIBILITY_ADVICE = {
  '1-1': 'Two leaders can clash. Practice compromise.',
  '1-2': 'Great balance! Leader meets diplomat.',
  '1-8': 'Power duo for business success.',
  '2-6': 'Harmonious nurturing energy.',
  '3-5': 'Creative and adventurous together.',
  '4-8': 'Strong foundation for material success.',
  '7-9': 'Deep spiritual connection.',
  '11-22': 'Master number synergy - transformative.',
};

// Get current date in EST timezone
const getESTDate = () => {
  const now = new Date();
  const year = now.toLocaleString('en-US', { timeZone: 'America/New_York', year: 'numeric' });
  const month = now.toLocaleString('en-US', { timeZone: 'America/New_York', month: '2-digit' });
  const day = now.toLocaleString('en-US', { timeZone: 'America/New_York', day: '2-digit' });
  return `${year}-${month}-${day}`;
};

const getESTDateObject = () => {
  const now = new Date();
  const estString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
  return new Date(estString);
};

export default function PersonalDashboard() {
  const [userMember, setUserMember] = useState(null);
  const [todayCalc, setTodayCalc] = useState(null);
  const [weekForecast, setWeekForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (userMember) {
      loadWeekForecast();
    }
  }, [userMember, weekOffset]);

  const loadUserData = async () => {
    setIsLoading(true);
    const user = await base44.auth.me();
    
    // Find member by email - this links the user to their profile
    let members = await base44.entities.FamilyMember.filter({ email: user.email });
    let selfMember = members.find(m => m.relationship === 'self') || members[0];
    
    // Fallback: if no member found by email, check for members created by this user
    if (!selfMember) {
      const createdMembers = await base44.entities.FamilyMember.filter({ created_by: user.email });
      selfMember = createdMembers.find(m => m.relationship === 'self') || createdMembers[0];
    }
    
    if (selfMember) {
      setUserMember(selfMember);
      
      // Get today's numbers in EST
      const today = getESTDate();
      // Extract birth month/day for personal calculations
      let birthMonth = null;
      let birthDay = null;
      if (selfMember.birth_date_encrypted) {
        const decryptResponse = await base44.functions.invoke('encryptData', {
          action: 'decrypt',
          data: { birth_date_encrypted: selfMember.birth_date_encrypted }
        });
        if (decryptResponse.data?.decrypted?.birth_date) {
          const bd = new Date(decryptResponse.data.decrypted.birth_date);
          birthMonth = bd.getUTCMonth() + 1;
          birthDay = bd.getUTCDate();
        }
      } else if (selfMember.date_of_birth) {
        const bd = new Date(selfMember.date_of_birth);
        birthMonth = bd.getUTCMonth() + 1;
        birthDay = bd.getUTCDate();
      }
      
      const response = await base44.functions.invoke('calculateNumerology', {
        type: 'dayNumbers',
        date: today,
        lifePath: selfMember.life_path_western,
        birthMonth,
        birthDay
      });
      
      if (response.data?.success) {
        setTodayCalc(response.data.data);
      }
    }
    setIsLoading(false);
  };

  const loadWeekForecast = async () => {
    const startDate = getESTDateObject();
    startDate.setDate(startDate.getDate() + (weekOffset * 7));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const response = await base44.functions.invoke('populateCalendarPredictions', {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      lifePath: userMember?.life_path_western
    });

    if (response.data?.success) {
      setWeekForecast(response.data.data.predictions);
    }
  };

  const getMeaning = (num) => NUMBER_MEANINGS[num] || NUMBER_MEANINGS[num % 9 || 9];
  
  const getActionableAdvice = () => {
    if (!userMember || !todayCalc) return [];
    
    const advice = [];
    const personalDay = todayCalc.personalDay || todayCalc.universalDay;
    const universalDay = todayCalc.universalDay;
    const lifePath = userMember.life_path_western;
    
    // Get user's master numbers
    const userMasterNumbers = userMember.master_numbers 
      ? userMember.master_numbers.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
      : [];
    
    // Life path + personal day synergy
    if (personalDay === lifePath) {
      const isMasterLifePath = [11, 22, 33].includes(lifePath);
      advice.push({ 
        icon: Sparkles, 
        text: isMasterLifePath 
          ? `🔥 POWER DAY! Master ${lifePath} aligned - your personal day matches your life path. Maximum spiritual power and manifestation.`
          : '⚡ Power Day! Your personal day matches your life path. Maximum alignment for personal growth.', 
        type: 'power' 
      });
    }
    
    // Master number matching - check if any user master numbers match universal/personal day
    if (userMasterNumbers.includes(universalDay)) {
      const masterPowers = {
        11: { power: 'Illumination', desc: 'Your visionary gifts are supercharged. Trust your intuition completely. Messages from higher realms flow through you.' },
        22: { power: 'Master Building', desc: 'Your ability to manifest dreams into reality is at peak power. Start major projects or make bold moves.' },
        33: { power: 'Divine Teaching', desc: 'Your healing and teaching abilities are amplified. Your words carry extra weight and can transform others.' }
      };
      const mp = masterPowers[universalDay];
      if (mp) {
        advice.push({ 
          icon: Sparkles, 
          text: `✨ MASTER ${universalDay} ACTIVATION! ${mp.power} - ${mp.desc}`, 
          type: 'master-power' 
        });
      }
    }
    
    if (userMasterNumbers.includes(personalDay) && personalDay !== universalDay) {
      const masterPowers = {
        11: { power: 'Inner Vision', desc: 'Personal intuition heightened. Pay attention to dreams and gut feelings.' },
        22: { power: 'Personal Mastery', desc: 'Structure your day for maximum achievement. Your organizational power peaks.' },
        33: { power: 'Compassion Flow', desc: 'Your empathy is extraordinary today. Healing conversations are favored.' }
      };
      const mp = masterPowers[personalDay];
      if (mp) {
        advice.push({ 
          icon: Sun, 
          text: `🌟 Personal Master ${personalDay}: ${mp.power} - ${mp.desc}`, 
          type: 'master' 
        });
      }
    }
    
    // Expression/Destiny matching universal day
    if (userMember.expression_western === universalDay) {
      advice.push({ 
        icon: Users, 
        text: `💫 Destiny Alignment! Universal day ${universalDay} matches your Expression number. Your purpose shines brightly - share your gifts with the world.`, 
        type: 'destiny' 
      });
    }
    
    // Soul Urge matching universal day
    if (userMember.soul_urge_western === universalDay) {
      advice.push({ 
        icon: Heart, 
        text: `💖 Heart's Desire Day! The universe resonates with your soul urge (${universalDay}). Follow your deepest desires - they lead to fulfillment.`, 
        type: 'soul' 
      });
    }
    
    // Personality matching universal day
    if (userMember.personality_western === universalDay) {
      advice.push({ 
        icon: Users, 
        text: `🎭 Charisma Boost! Your personality number (${universalDay}) aligns with universal energy. Social interactions flow effortlessly - network and connect.`, 
        type: 'personality' 
      });
    }
    
    // Birthday number matching
    if (userMember.birthday_number === universalDay) {
      advice.push({ 
        icon: Calendar, 
        text: `🎂 Birthday Vibe Day! Universal energy (${universalDay}) echoes your birth day gifts. Natural talents are amplified.`, 
        type: 'birthday' 
      });
    }
    
    // Master number days (only show separately if not already covered)
    if ([11, 22, 33].includes(personalDay) && personalDay !== lifePath && !userMasterNumbers.includes(personalDay)) {
      advice.push({ icon: Sun, text: `Master ${personalDay} energy active. Heightened intuition and manifestation potential.`, type: 'master' });
    }
    
    // Based on personal day
    if ([1, 8].includes(personalDay)) {
      advice.push({ icon: Briefcase, text: 'Career focus day. Take action on professional goals.', type: 'career' });
    }
    if ([2, 6].includes(personalDay)) {
      advice.push({ icon: Heart, text: 'Relationships highlighted. Connect with loved ones.', type: 'love' });
    }
    if ([3, 5].includes(personalDay)) {
      advice.push({ icon: TrendingUp, text: 'Creative expression favored. Share your ideas.', type: 'creative' });
    }
    if ([7, 9].includes(personalDay)) {
      advice.push({ icon: Moon, text: 'Spiritual awareness heightened. Meditate or journal.', type: 'spiritual' });
    }
    
    // Expression number influence (general harmony)
    if (userMember.expression_western && userMember.expression_western !== universalDay) {
      const expr = userMember.expression_western;
      if ((personalDay + expr) % 9 === 0) {
        advice.push({ icon: Users, text: 'Expression harmony active. Communication flows easily.', type: 'expression' });
      }
    }
    
    return advice;
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
          {/* Profile Setup Prompt */}
          <Card className="bg-amber-500/20 backdrop-blur-sm border-amber-500/30 mb-6">
            <CardContent className="py-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Sparkles className="w-10 h-10 text-amber-400 flex-shrink-0" />
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">Create Your Numerology Profile</h2>
                    <p className="text-gray-300 mb-4">Get personalized daily insights, life path analysis, and weekly forecasts based on your birth date and name.</p>
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => window.location.href = createPageUrl('AddFamilyMember') + '?setupSelf=true'}
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Create My Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* General Info for users without profile */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Numerology Dashboard</h1>
            <p className="text-gray-400">Create your profile above to unlock personalized insights</p>
          </div>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sun className="w-5 h-5 text-yellow-400" />
                Today's Universal Energy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">Set up your profile to see how today's energy affects you personally.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const actionableAdvice = getActionableAdvice();
  const todayMeaning = todayCalc ? getMeaning(todayCalc.personalDay || todayCalc.universalDay) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome, {userMember.nickname || userMember.full_name?.split(' ')[0]}
          </h1>
          <p className="text-gray-300">Your Personal Numerology Dashboard</p>
        </div>

        {/* Core Numbers */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Your Core Numbers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg text-center border border-amber-500/30">
                <p className="text-xs text-amber-300 mb-2">Life Path</p>
                <NumberBadge number={userMember.life_path_western} size="lg" />
                <p className="text-amber-200 text-xs mt-2">{getMeaning(userMember.life_path_western)?.title}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg text-center border border-purple-500/30">
                <p className="text-xs text-purple-300 mb-2">Expression/Destiny</p>
                <NumberBadge number={userMember.expression_western} size="lg" />
                <p className="text-purple-200 text-xs mt-2">{getMeaning(userMember.expression_western)?.title}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-lg text-center border border-pink-500/30">
                <p className="text-xs text-pink-300 mb-2">Soul Urge</p>
                <NumberBadge number={userMember.soul_urge_western} size="lg" />
                <p className="text-pink-200 text-xs mt-2">{getMeaning(userMember.soul_urge_western)?.title}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg text-center border border-cyan-500/30">
                <p className="text-xs text-cyan-300 mb-2">Personality</p>
                <NumberBadge number={userMember.personality_western} size="lg" />
                <p className="text-cyan-200 text-xs mt-2">{getMeaning(userMember.personality_western)?.title}</p>
              </div>
            </div>
            
            {/* Master Numbers & Karmic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              {userMember.master_numbers && (
                <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <p className="text-xs text-amber-300 mb-2">Master Numbers</p>
                  <div className="flex gap-2 flex-wrap">
                    {userMember.master_numbers.split(',').map((num, i) => (
                      <NumberBadge key={i} number={parseInt(num)} size="sm" />
                    ))}
                  </div>
                </div>
              )}
              {userMember.karmic_debt_number && (
                <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <p className="text-xs text-red-300 mb-2">Karmic Debt</p>
                  <div className="flex gap-2 flex-wrap">
                    {userMember.karmic_debt_number.split(',').map((num, i) => (
                      <span key={i} className="px-2 py-1 bg-red-500/20 rounded text-red-300 text-sm font-medium">{num.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
              {userMember.karmic_lessons && (
                <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <p className="text-xs text-orange-300 mb-2">Karmic Lessons</p>
                  <div className="flex gap-1 flex-wrap">
                    {userMember.karmic_lessons.split(',').map((num, i) => (
                      <NumberBadge key={i} number={parseInt(num.trim())} size="sm" />
                    ))}
                  </div>
                </div>
              )}
            </div>
            </CardContent>
            </Card>

        {/* Today's Energy */}
        {todayCalc && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sun className="w-5 h-5 text-yellow-400" />
                Today's Energy - {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex gap-4 mb-4">
                    <div className="p-4 bg-white/5 rounded-lg text-center flex-1">
                      <p className="text-xs text-gray-400 mb-2">Universal Day</p>
                      <NumberBadge number={todayCalc.universalDay} size="lg" />
                    </div>
                    <div className="p-4 bg-amber-500/20 rounded-lg text-center flex-1 border border-amber-500/30">
                      <p className="text-xs text-amber-300 mb-2">Your Personal Day</p>
                      <NumberBadge number={todayCalc.personalDay} size="lg" />
                    </div>
                  </div>
                  
                  {(todayCalc.personalMonth || todayCalc.personalYear) && (
                    <div className="flex gap-4 mb-4">
                      {todayCalc.personalMonth && (
                        <div className="p-3 bg-purple-500/20 rounded-lg text-center flex-1 border border-purple-500/30">
                          <p className="text-xs text-purple-300 mb-2">Personal Month</p>
                          <NumberBadge number={todayCalc.personalMonth} size="md" />
                        </div>
                      )}
                      {todayCalc.personalYear && (
                        <div className="p-3 bg-purple-500/20 rounded-lg text-center flex-1 border border-purple-500/30">
                          <p className="text-xs text-purple-300 mb-2">Personal Year</p>
                          <NumberBadge number={todayCalc.personalYear} size="md" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {todayMeaning && (
                    <div className="p-4 bg-white/5 rounded-lg">
                      <h3 className="text-white font-semibold mb-2">{todayMeaning.title}</h3>
                      <p className="text-gray-300 text-sm mb-3">{todayMeaning.advice}</p>
                      <div className="flex flex-wrap gap-2">
                        {todayMeaning.keywords.map((kw, i) => (
                          <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Actionable Advice */}
                <div className="space-y-3">
                  <p className="text-sm text-gray-400 font-medium">Personalized Advice for Today</p>
                  {actionableAdvice.length > 0 ? (
                    actionableAdvice.map((item, i) => (
                      <div key={i} className={`p-3 rounded-lg flex items-start gap-3 ${
                        item.type === 'power' ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/30 border-2 border-amber-500' :
                        item.type === 'master-power' ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-2 border-purple-400 animate-pulse' :
                        item.type === 'master' ? 'bg-purple-500/20 border border-purple-500/30' :
                        item.type === 'destiny' ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30' :
                        item.type === 'soul' ? 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30' :
                        item.type === 'personality' ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30' :
                        item.type === 'birthday' ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30' :
                        item.type === 'career' ? 'bg-blue-500/20 border border-blue-500/30' :
                        item.type === 'love' ? 'bg-pink-500/20 border border-pink-500/30' :
                        item.type === 'creative' ? 'bg-green-500/20 border border-green-500/30' :
                        item.type === 'spiritual' ? 'bg-indigo-500/20 border border-indigo-500/30' :
                        'bg-white/10'
                      }`}>
                        <item.icon className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                        <p className="text-white text-sm">{item.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-white/10 rounded-lg">
                      <p className="text-gray-300 text-sm">{todayCalc.recommendations}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Astrology Summary */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-400" />
              Today's Astrology Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DailyAstrologySummary userMember={userMember} />
          </CardContent>
        </Card>

        {/* Daily Meal Recommendations Link */}
        <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border-amber-500/30 mb-6 hover:scale-[1.02] transition-all cursor-pointer"
          onClick={() => window.location.href = createPageUrl('MealRecommendations')}>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Utensils className="w-10 h-10 text-amber-400" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Daily Meal Recommendations</h3>
                  <p className="text-gray-300 text-sm">Get personalized meal suggestions based on your numerology and today's energy</p>
                </div>
              </div>
              <Button className="bg-amber-600 hover:bg-amber-700">
                View Meals
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Daily Songs */}
        <div className="mb-6">
          <DailySongs />
        </div>

        {/* Weekly Forecast */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-400" />
                Weekly Forecast
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setWeekOffset(w => w - 1)} className="text-gray-400 hover:text-white">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setWeekOffset(0)} className="text-gray-400 hover:text-white text-xs">
                  This Week
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setWeekOffset(w => w + 1)} className="text-gray-400 hover:text-white">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weekForecast.map((day, i) => {
                const date = new Date(day.date + 'T12:00:00');
                const isToday = day.date === getESTDate();
                const meaning = getMeaning(day.personal_day_number || day.universal_day_number);
                
                return (
                  <div 
                    key={i} 
                    className={`p-3 rounded-lg text-center transition-all hover:scale-105 cursor-pointer ${
                      isToday ? 'bg-amber-500/30 border-2 border-amber-500' :
                      day.is_master_day ? 'bg-purple-500/20 border border-purple-500/30' :
                      day.is_power_day ? 'bg-green-500/20 border border-green-500/30' :
                      day.is_aligned ? 'bg-blue-500/20 border border-blue-500/30' :
                      'bg-white/5 border border-white/10'
                    }`}
                  >
                    <p className="text-xs text-gray-400">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                    <p className="text-white font-bold">{date.getDate()}</p>
                    <div className="my-2">
                      <NumberBadge number={day.personal_day_number || day.universal_day_number} size="sm" />
                    </div>
                    <p className="text-xs text-gray-300 truncate" title={meaning?.title}>{meaning?.title?.split(' ')[1]}</p>
                    {day.is_master_day && <Sparkles className="w-3 h-3 text-amber-400 mx-auto mt-1" />}
                  </div>
                );
              })}
            </div>
            
            {/* Week Summary */}
            <div className="mt-4 p-4 bg-white/5 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Week Highlights</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {weekForecast.filter(d => d.is_master_day).length > 0 && (
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                    {weekForecast.filter(d => d.is_master_day).length} Master Day(s)
                  </span>
                )}
                {weekForecast.filter(d => d.is_power_day).length > 0 && (
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">
                    {weekForecast.filter(d => d.is_power_day).length} Power Day(s)
                  </span>
                )}
                {weekForecast.filter(d => d.is_aligned).length > 0 && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    {weekForecast.filter(d => d.is_aligned).length} Aligned Day(s)
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}