import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, AlertTriangle, Moon, Sun, Star } from 'lucide-react';

// Current retrogrades (hardcoded for now, can be made dynamic later)
const CURRENT_RETROGRADES = [
  { planet: 'Mercury', symbol: '☿', start: '2024-11-25', end: '2024-12-15', effects: ['communication issues', 'tech glitches', 'travel delays', 'misunderstandings'] },
  { planet: 'Mars', symbol: '♂', start: '2024-12-06', end: '2025-02-23', effects: ['low energy', 'frustration', 'avoid new projects', 'review actions'] },
  { planet: 'Uranus', symbol: '♅', start: '2024-09-01', end: '2025-01-30', effects: ['unexpected changes', 'rebellion energy', 'tech disruptions'] },
  { planet: 'Neptune', symbol: '♆', start: '2024-07-02', end: '2024-12-07', effects: ['confusion', 'illusions', 'spiritual insights', 'dreams vivid'] }
];

// Zodiac info for birth date Nov 7, 1969
const getZodiacInfo = (birthDate) => {
  // Default to Scorpio for 11/07/1969
  return {
    sunSign: 'Scorpio',
    moonSign: 'Gemini', // Approximate for 11:06 PM EST
    risingSign: 'Leo', // Approximate for 11:06 PM EST Drexel Hill PA
    element: 'Water',
    modality: 'Fixed',
    rulingPlanet: 'Pluto'
  };
};

// How retrogrades affect each sign
const RETROGRADE_EFFECTS = {
  Mercury: {
    Scorpio: 'Mercury retrograde in your sign intensifies miscommunications. Triple-check important messages.',
    Gemini: 'Your ruling planet is retrograde - expect heightened sensitivity to mix-ups.',
    Leo: 'Creative projects may stall. Use this time to revise rather than launch.',
    default: 'Communication and travel may be disrupted. Back up important data.'
  },
  Mars: {
    Scorpio: 'Mars retrograde affects your co-ruler - energy may feel blocked. Practice patience.',
    Leo: 'Avoid ego conflicts. Channel frustration into physical exercise.',
    default: 'Low energy period. Review rather than start new initiatives.'
  },
  Uranus: {
    Scorpio: 'Unexpected transformations possible. Embrace change rather than resist.',
    Leo: 'Career surprises possible. Stay flexible with plans.',
    default: 'Expect the unexpected. Old patterns may suddenly break.'
  },
  Neptune: {
    Scorpio: 'Intuition heightened but may be unreliable. Ground yourself.',
    Gemini: 'Mental fog possible. Don\'t make major decisions.',
    default: 'Dreams and intuition active. Distinguish fantasy from reality.'
  }
};

export default function DailyAstrologySummary({ userMember }) {
  const [astroSummary, setAstroSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateSummary();
  }, [userMember]);

  const generateSummary = async () => {
    setLoading(true);
    
    // Get user's zodiac info from member or calculate
    const zodiac = userMember?.sun_sign ? {
      sunSign: userMember.sun_sign,
      moonSign: userMember.moon_sign || 'Unknown',
      risingSign: userMember.ascendant || 'Unknown',
      element: userMember.element || 'Unknown'
    } : getZodiacInfo(userMember?.birth_date);

    // Check active retrogrades
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const activeRetrogrades = CURRENT_RETROGRADES.filter(r => {
      return todayStr >= r.start && todayStr <= r.end;
    });

    // Get retrograde warnings for this user
    const retroWarnings = activeRetrogrades.map(retro => {
      const signEffect = RETROGRADE_EFFECTS[retro.planet]?.[zodiac.sunSign] || 
                        RETROGRADE_EFFECTS[retro.planet]?.[zodiac.moonSign] ||
                        RETROGRADE_EFFECTS[retro.planet]?.default;
      return {
        ...retro,
        personalEffect: signEffect
      };
    });

    // Generate daily summary using LLM
    const prompt = `Generate a brief, personalized daily astrology summary for someone with:
- Sun Sign: ${zodiac.sunSign}
- Moon Sign: ${zodiac.moonSign}
- Rising Sign: ${zodiac.risingSign}
- Element: ${zodiac.element}
- Life Path Number: ${userMember?.life_path_western || 'Unknown'}

Today is ${today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.

Active planetary retrogrades: ${activeRetrogrades.map(r => r.planet).join(', ') || 'None'}

Provide a 2-3 sentence daily overview focusing on energy, mood, and best activities. Keep it practical and encouraging.`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            overview: { type: 'string' },
            bestActivities: { type: 'array', items: { type: 'string' } },
            cautionAreas: { type: 'array', items: { type: 'string' } },
            luckyNumber: { type: 'integer' },
            luckyColor: { type: 'string' }
          }
        }
      });

      setAstroSummary({
        zodiac,
        retrogrades: retroWarnings,
        ...response
      });
    } catch (error) {
      // Fallback if LLM fails
      setAstroSummary({
        zodiac,
        retrogrades: retroWarnings,
        overview: `As a ${zodiac.sunSign} with ${zodiac.moonSign} Moon, today brings ${zodiac.element} energy to your endeavors. Trust your intuition and stay grounded.`,
        bestActivities: ['meditation', 'planning', 'connecting with loved ones'],
        cautionAreas: activeRetrogrades.length > 0 ? ['major decisions', 'signing contracts'] : [],
        luckyNumber: userMember?.life_path_western || 7,
        luckyColor: zodiac.element === 'Water' ? 'blue' : zodiac.element === 'Fire' ? 'red' : zodiac.element === 'Earth' ? 'green' : 'yellow'
      });
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 py-4">
        <Loader2 className="w-4 h-4 animate-spin" />
        Generating your daily astrology...
      </div>
    );
  }

  if (!astroSummary) return null;

  return (
    <div className="space-y-4">
      {/* Big Three Display */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 rounded-full">
          <Sun className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-300 text-sm">{astroSummary.zodiac?.sunSign || 'Unknown'}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full">
          <Moon className="w-4 h-4 text-blue-400" />
          <span className="text-blue-300 text-sm">{astroSummary.zodiac?.moonSign || 'Unknown'}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full">
          <Star className="w-4 h-4 text-purple-400" />
          <span className="text-purple-300 text-sm">↑ {astroSummary.zodiac?.risingSign || 'Unknown'}</span>
        </div>
      </div>

      {/* Daily Overview */}
      <div className="p-4 bg-white/5 rounded-lg">
        <p className="text-gray-200">{astroSummary.overview}</p>
      </div>

      {/* Best Activities & Lucky */}
      <div className="grid md:grid-cols-2 gap-4">
        {astroSummary.bestActivities?.length > 0 && (
          <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <p className="text-xs text-green-400 mb-2">Best Activities Today</p>
            <div className="flex flex-wrap gap-1">
              {astroSummary.bestActivities.map((act, i) => (
                <span key={i} className="px-2 py-0.5 bg-green-500/20 text-green-300 rounded text-xs">{act}</span>
              ))}
            </div>
          </div>
        )}
        <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <p className="text-xs text-amber-400 mb-2">Lucky Vibes</p>
          <div className="flex gap-3 text-sm">
            <span className="text-amber-300">Number: <strong>{astroSummary.luckyNumber}</strong></span>
            <span className="text-amber-300">Color: <strong className="capitalize">{astroSummary.luckyColor}</strong></span>
          </div>
        </div>
      </div>

      {/* Retrograde Warnings */}
      {astroSummary.retrogrades?.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-red-400 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Active Retrogrades Affecting You
          </p>
          {astroSummary.retrogrades.map((retro, i) => (
            <div key={i} className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-red-300 font-medium">{retro.symbol} {retro.planet} Retrograde</span>
                <span className="text-red-400 text-xs">until {new Date(retro.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              <p className="text-red-200 text-sm">{retro.personalEffect}</p>
            </div>
          ))}
        </div>
      )}

      {/* Caution Areas */}
      {astroSummary.cautionAreas?.length > 0 && (
        <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <p className="text-xs text-orange-400 mb-2">Use Caution With</p>
          <div className="flex flex-wrap gap-1">
            {astroSummary.cautionAreas.map((area, i) => (
              <span key={i} className="px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded text-xs">{area}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}