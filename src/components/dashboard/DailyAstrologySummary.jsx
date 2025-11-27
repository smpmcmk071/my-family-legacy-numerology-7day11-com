import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, AlertTriangle, Moon, Sun, Star } from 'lucide-react';

// Current and upcoming retrogrades for 2024-2025
const CURRENT_RETROGRADES = [
  // Mercury Retrogrades 2025
  { planet: 'Mercury', symbol: '☿', start: '2025-03-14', end: '2025-04-07', effects: ['communication issues', 'tech glitches', 'travel delays', 'misunderstandings'], inSign: 'Aries/Pisces' },
  { planet: 'Mercury', symbol: '☿', start: '2025-07-18', end: '2025-08-11', effects: ['communication issues', 'tech glitches', 'travel delays', 'misunderstandings'], inSign: 'Leo' },
  { planet: 'Mercury', symbol: '☿', start: '2025-11-09', end: '2025-11-29', effects: ['communication issues', 'tech glitches', 'travel delays', 'misunderstandings'], inSign: 'Sagittarius' },
  
  // Mars Retrograde
  { planet: 'Mars', symbol: '♂', start: '2024-12-06', end: '2025-02-23', effects: ['low energy', 'frustration', 'avoid new projects', 'review actions'], inSign: 'Leo/Cancer' },
  
  // Jupiter Retrograde
  { planet: 'Jupiter', symbol: '♃', start: '2025-11-11', end: '2026-03-10', effects: ['reflect on growth', 'inner expansion', 'spiritual lessons'], inSign: 'Cancer' },
  
  // Saturn Retrograde
  { planet: 'Saturn', symbol: '♄', start: '2025-07-13', end: '2025-11-27', effects: ['karmic lessons', 'restructuring', 'patience required'], inSign: 'Pisces/Aries' },
  
  // Uranus Retrograde
  { planet: 'Uranus', symbol: '♅', start: '2025-09-06', end: '2026-02-04', effects: ['unexpected changes', 'rebellion energy', 'tech disruptions'], inSign: 'Taurus/Gemini' },
  
  // Neptune Retrograde
  { planet: 'Neptune', symbol: '♆', start: '2025-07-04', end: '2025-12-10', effects: ['confusion', 'illusions', 'spiritual insights', 'vivid dreams'], inSign: 'Pisces/Aries' },
  
  // Pluto Retrograde
  { planet: 'Pluto', symbol: '♇', start: '2025-05-04', end: '2025-10-13', effects: ['deep transformation', 'power dynamics', 'shadow work'], inSign: 'Aquarius' },
  
  // Venus Retrograde
  { planet: 'Venus', symbol: '♀', start: '2025-03-01', end: '2025-04-12', effects: ['relationship reviews', 'money matters', 'self-worth issues', 'ex returns'], inSign: 'Aries/Pisces' }
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
    Scorpio: 'Mercury retrograde intensifies miscommunications. Triple-check important messages.',
    Gemini: 'Your ruling planet is retrograde - expect heightened sensitivity to mix-ups.',
    Virgo: 'Your ruling planet is retrograde - details may slip. Double-check everything.',
    Leo: 'Creative projects may stall. Use this time to revise rather than launch.',
    Aries: 'Impatience with delays peaks. Breathe before responding.',
    default: 'Communication and travel may be disrupted. Back up important data.'
  },
  Venus: {
    Taurus: 'Your ruling planet is retrograde - relationship and money matters need review.',
    Libra: 'Your ruling planet is retrograde - love and beauty matters under review.',
    Scorpio: 'Past relationships may resurface. Reflect before reconnecting.',
    default: 'Relationship reviews, money matters need attention. Avoid major purchases.'
  },
  Mars: {
    Aries: 'Your ruling planet is retrograde - energy blocked. Channel frustration wisely.',
    Scorpio: 'Mars retrograde affects your co-ruler - energy may feel blocked. Practice patience.',
    Leo: 'Avoid ego conflicts. Channel frustration into physical exercise.',
    default: 'Low energy period. Review rather than start new initiatives.'
  },
  Jupiter: {
    Sagittarius: 'Your ruling planet is retrograde - inner growth over outer expansion.',
    Pisces: 'Your co-ruler is retrograde - spiritual insights deepen.',
    default: 'Time for inner expansion and reflecting on growth.'
  },
  Saturn: {
    Capricorn: 'Your ruling planet is retrograde - karmic restructuring in progress.',
    Aquarius: 'Your co-ruler is retrograde - patience with structures and systems.',
    default: 'Karmic lessons surface. Patience and restructuring required.'
  },
  Uranus: {
    Aquarius: 'Your ruling planet is retrograde - inner revolution brewing.',
    Scorpio: 'Unexpected transformations possible. Embrace change rather than resist.',
    Leo: 'Career surprises possible. Stay flexible with plans.',
    Taurus: 'Uranus in your sign retrograde - internal shifts before external changes.',
    default: 'Expect the unexpected. Old patterns may suddenly break.'
  },
  Neptune: {
    Pisces: 'Your ruling planet is retrograde - heightened intuition but verify insights.',
    Scorpio: 'Intuition heightened but may be unreliable. Ground yourself.',
    Gemini: 'Mental fog possible. Don\'t make major decisions.',
    default: 'Dreams and intuition active. Distinguish fantasy from reality.'
  },
  Pluto: {
    Scorpio: 'Your ruling planet is retrograde - deep internal transformation.',
    default: 'Deep transformation underway. Shadow work favored.'
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

    // Get upcoming retrogrades (next 60 days)
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + 60);
    const futureDateStr = futureDate.toISOString().split('T')[0];
    const upcomingRetrogrades = CURRENT_RETROGRADES.filter(r => {
      return r.start > todayStr && r.start <= futureDateStr;
    }).sort((a, b) => a.start.localeCompare(b.start));

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
        upcomingRetrogrades,
        ...response
      });
    } catch (error) {
      // Fallback if LLM fails
      setAstroSummary({
        zodiac,
        retrogrades: retroWarnings,
        upcomingRetrogrades,
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

      {/* Retrograde Status Section */}
      <div className="space-y-3">
        <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
          🪐 Planetary Retrograde Status
        </p>
        
        {astroSummary.retrogrades?.length > 0 ? (
          <div className="space-y-2">
            {astroSummary.retrogrades.map((retro, i) => (
              <div key={i} className={`p-3 rounded-lg border ${
                retro.planet === 'Mercury' ? 'bg-orange-500/15 border-orange-500/30' :
                retro.planet === 'Venus' ? 'bg-pink-500/15 border-pink-500/30' :
                retro.planet === 'Mars' ? 'bg-red-500/15 border-red-500/30' :
                'bg-purple-500/15 border-purple-500/30'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{retro.symbol}</span>
                    <div>
                      <span className={`font-medium ${
                        retro.planet === 'Mercury' ? 'text-orange-300' :
                        retro.planet === 'Venus' ? 'text-pink-300' :
                        retro.planet === 'Mars' ? 'text-red-300' :
                        'text-purple-300'
                      }`}>{retro.planet} Retrograde</span>
                      {retro.inSign && <span className="text-gray-400 text-xs ml-2">in {retro.inSign}</span>}
                    </div>
                  </div>
                  <span className="text-gray-400 text-xs">ends {new Date(retro.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <p className="text-gray-300 text-sm">{retro.personalEffect}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {retro.effects?.slice(0, 3).map((effect, j) => (
                    <span key={j} className="px-2 py-0.5 bg-white/10 text-gray-400 rounded text-xs">{effect}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20 text-center">
            <span className="text-green-300 text-sm">✨ No major retrogrades active! Clear skies for forward movement.</span>
          </div>
        )}

        {/* Upcoming Retrogrades Preview */}
        {astroSummary.upcomingRetrogrades?.length > 0 && (
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <p className="text-xs text-gray-500 mb-2">Coming Soon</p>
            <div className="flex flex-wrap gap-2">
              {astroSummary.upcomingRetrogrades.slice(0, 3).map((retro, i) => (
                <span key={i} className="px-2 py-1 bg-white/10 text-gray-400 rounded text-xs">
                  {retro.symbol} {retro.planet} starts {new Date(retro.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

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