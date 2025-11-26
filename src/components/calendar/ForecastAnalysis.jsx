import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Rocket, DollarSign, Heart, Sparkles, Brain, Users, 
  Briefcase, AlertTriangle, Shield, Calendar, Star
} from 'lucide-react';
import NumberBadge from '../legacy/NumberBadge';

const activityMappings = {
  newProjects: {
    title: "New Projects & Initiatives",
    icon: Rocket,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    bestNumbers: [1, 3, 8, 11, 22],
    description: "Days ideal for launching, starting fresh, or taking initiative"
  },
  financial: {
    title: "Financial Matters",
    icon: DollarSign,
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    bestNumbers: [4, 8, 22],
    description: "Best for investments, contracts, business deals"
  },
  relationships: {
    title: "Relationships & Love",
    icon: Heart,
    color: "text-pink-400",
    bgColor: "bg-pink-500/20",
    bestNumbers: [2, 6, 9, 33],
    description: "Ideal for romance, partnerships, reconciliation"
  },
  spiritual: {
    title: "Spiritual Growth",
    icon: Sparkles,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    bestNumbers: [7, 9, 11, 33],
    description: "Best for meditation, introspection, healing"
  },
  creativity: {
    title: "Creative Work",
    icon: Brain,
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
    bestNumbers: [3, 5, 9, 11],
    description: "Perfect for art, writing, brainstorming"
  },
  networking: {
    title: "Social & Networking",
    icon: Users,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/20",
    bestNumbers: [3, 5, 6, 9],
    description: "Great for meetings, events, making connections"
  },
  career: {
    title: "Career & Recognition",
    icon: Briefcase,
    color: "text-orange-400",
    bgColor: "bg-orange-500/20",
    bestNumbers: [1, 4, 8, 22],
    description: "Best for interviews, promotions, presentations"
  }
};

const challengingCombinations = [
  { personal: 4, universal: 5, message: "Stability vs change tension - stay grounded" },
  { personal: 7, universal: 3, message: "Need for solitude vs social demands" },
  { personal: 1, universal: 2, message: "Leadership urge vs need for cooperation" },
  { personal: 8, universal: 7, message: "Material focus vs spiritual calling" },
  { personal: 5, universal: 4, message: "Freedom desire vs responsibilities" },
  { personal: 9, universal: 1, message: "Endings vs new beginnings - transition day" },
];

const karmicDebtDays = [13, 14, 16, 19];

export default function ForecastAnalysis({ forecast, userMember }) {
  if (!forecast || forecast.length === 0) return null;

  // Analyze best days for each activity
  const bestDays = {};
  Object.keys(activityMappings).forEach(activity => {
    const mapping = activityMappings[activity];
    bestDays[activity] = forecast.filter(day => {
      const uMatch = mapping.bestNumbers.includes(day.universal_day_number);
      const pMatch = day.personal_day_number && mapping.bestNumbers.includes(day.personal_day_number);
      // Best when both align, good when at least one matches
      return uMatch || pMatch;
    }).map(day => ({
      ...day,
      strength: (mapping.bestNumbers.includes(day.universal_day_number) ? 1 : 0) +
                (day.personal_day_number && mapping.bestNumbers.includes(day.personal_day_number) ? 1 : 0)
    })).sort((a, b) => b.strength - a.strength).slice(0, 5);
  });

  // Find challenging periods
  const challengingDays = forecast.filter(day => {
    // Check for challenging combinations
    const hasChallenging = challengingCombinations.some(
      c => c.personal === day.personal_day_number && c.universal === day.universal_day_number
    );
    // Check for karmic debt days
    const hasKarmicDebt = day.caution_alerts?.length > 0;
    return hasChallenging || hasKarmicDebt;
  }).map(day => {
    const combo = challengingCombinations.find(
      c => c.personal === day.personal_day_number && c.universal === day.universal_day_number
    );
    return {
      ...day,
      challengeMessage: combo?.message || day.caution_alerts?.[0]?.message || "Energy may feel off - take it slow"
    };
  });

  // Find power days (when personal and universal are same or harmonious)
  const powerDays = forecast.filter(day => {
    if (!day.personal_day_number) return false;
    // Same number = double power
    if (day.personal_day_number === day.universal_day_number) return true;
    // Harmonious combinations
    const harmonious = [
      [1, 5], [1, 9], [2, 6], [3, 6], [3, 9], [4, 8], [7, 11], [8, 22], [6, 33]
    ];
    return harmonious.some(([a, b]) => 
      (day.personal_day_number === a && day.universal_day_number === b) ||
      (day.personal_day_number === b && day.universal_day_number === a)
    );
  });

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Power Days Summary */}
      {powerDays.length > 0 && (
        <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <Star className="w-5 h-5 text-amber-400" />
              Your Power Days ({powerDays.length})
            </CardTitle>
            <p className="text-amber-200 text-sm">Days when personal and universal energies harmonize</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {powerDays.slice(0, 10).map(day => (
                <div key={day.date} className="px-3 py-2 bg-black/30 rounded-lg text-center">
                  <p className="text-amber-300 text-xs">{formatDate(day.date)}</p>
                  <div className="flex items-center gap-1 justify-center mt-1">
                    <NumberBadge number={day.universal_day_number} size="xs" />
                    <span className="text-gray-400">+</span>
                    <NumberBadge number={day.personal_day_number} size="xs" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Best Days by Activity */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-green-400" />
            Best Days by Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(activityMappings).map(([key, mapping]) => {
              const Icon = mapping.icon;
              const days = bestDays[key];
              if (!days || days.length === 0) return null;
              
              return (
                <div key={key} className={`p-4 rounded-lg ${mapping.bgColor} border border-white/10`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-5 h-5 ${mapping.color}`} />
                    <h4 className="text-white font-medium">{mapping.title}</h4>
                  </div>
                  <p className="text-gray-400 text-xs mb-3">{mapping.description}</p>
                  <div className="space-y-1">
                    {days.slice(0, 3).map(day => (
                      <div key={day.date} className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">{formatDate(day.date)}</span>
                        <div className="flex items-center gap-1">
                          <NumberBadge number={day.universal_day_number} size="xs" />
                          {day.personal_day_number && (
                            <>
                              <span className="text-gray-500">/</span>
                              <NumberBadge number={day.personal_day_number} size="xs" />
                            </>
                          )}
                          {day.strength === 2 && <Star className="w-3 h-3 text-amber-400 ml-1" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Challenging Periods */}
      {challengingDays.length > 0 && (
        <Card className="bg-red-500/10 border-red-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-red-400" />
              Challenging Periods & Guidance ({challengingDays.length})
            </CardTitle>
            <p className="text-red-200 text-sm">Days requiring extra awareness - not bad, just more demanding</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {challengingDays.slice(0, 7).map(day => (
                <div key={day.date} className="p-3 bg-black/30 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{formatDate(day.date)}</span>
                      <div className="flex items-center gap-1">
                        <NumberBadge number={day.universal_day_number} size="xs" />
                        {day.personal_day_number && (
                          <>
                            <span className="text-gray-500">/</span>
                            <NumberBadge number={day.personal_day_number} size="xs" />
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{day.challengeMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Summary */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg">45-Day Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <p className="text-2xl font-bold text-amber-400">{powerDays.length}</p>
              <p className="text-xs text-gray-400">Power Days</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <p className="text-2xl font-bold text-green-400">
                {forecast.filter(d => d.is_aligned).length}
              </p>
              <p className="text-xs text-gray-400">Aligned Days</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <p className="text-2xl font-bold text-purple-400">
                {forecast.filter(d => d.is_master_day).length}
              </p>
              <p className="text-xs text-gray-400">Master Days</p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-lg">
              <p className="text-2xl font-bold text-red-400">{challengingDays.length}</p>
              <p className="text-xs text-gray-400">Challenging Days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}