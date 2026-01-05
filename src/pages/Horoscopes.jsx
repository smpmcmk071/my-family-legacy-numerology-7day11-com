import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { base44 } from '@/api/base44Client';
import { Loader2, Sparkles, Calendar, TrendingUp } from 'lucide-react';

const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19', element: 'Fire', ruler: 'Mars' },
  { name: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20', element: 'Earth', ruler: 'Venus' },
  { name: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20', element: 'Air', ruler: 'Mercury' },
  { name: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22', element: 'Water', ruler: 'Moon' },
  { name: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22', element: 'Fire', ruler: 'Sun' },
  { name: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22', element: 'Earth', ruler: 'Mercury' },
  { name: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22', element: 'Air', ruler: 'Venus' },
  { name: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21', element: 'Water', ruler: 'Pluto' },
  { name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21', element: 'Fire', ruler: 'Jupiter' },
  { name: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19', element: 'Earth', ruler: 'Saturn' },
  { name: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18', element: 'Air', ruler: 'Uranus' },
  { name: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20', element: 'Water', ruler: 'Neptune' }
];

export default function Horoscopes() {
  const [selectedSign, setSelectedSign] = useState('Aries');
  const [period, setPeriod] = useState('daily');
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHoroscope();
  }, [selectedSign, period]);

  const loadHoroscope = async () => {
    setLoading(true);
    try {
      const sign = ZODIAC_SIGNS.find(s => s.name === selectedSign);
      const prompt = `Generate a ${period} horoscope for ${selectedSign} (${sign.element} sign, ruled by ${sign.ruler}).

Today's date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}

Provide:
- Overall energy and theme
- Love & relationships guidance
- Career & money outlook
- Health & wellness tips
- Lucky numbers and colors

Keep it insightful, positive, and practical. ${period === 'daily' ? '2-3 paragraphs.' : period === 'weekly' ? '3-4 paragraphs covering the week ahead.' : '4-5 paragraphs covering the month ahead.'}`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            overall: { type: 'string' },
            love: { type: 'string' },
            career: { type: 'string' },
            health: { type: 'string' },
            luckyNumbers: { type: 'array', items: { type: 'integer' } },
            luckyColors: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      setHoroscope(response);
    } catch (error) {
      console.error('Failed to load horoscope:', error);
    }
    setLoading(false);
  };

  const signInfo = ZODIAC_SIGNS.find(s => s.name === selectedSign);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Daily Horoscopes</h1>
          <p className="text-gray-300">Cosmic guidance for your zodiac sign</p>
        </div>

        {/* Zodiac Sign Selector */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {ZODIAC_SIGNS.map(sign => (
            <button
              key={sign.name}
              onClick={() => setSelectedSign(sign.name)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedSign === sign.name
                  ? 'border-amber-500 bg-amber-500/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-3xl mb-1">{sign.symbol}</div>
              <div className={`text-sm font-medium ${selectedSign === sign.name ? 'text-amber-300' : 'text-white'}`}>
                {sign.name}
              </div>
            </button>
          ))}
        </div>

        {/* Period Tabs */}
        <Tabs value={period} onValueChange={setPeriod} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/10">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Sign Info Card */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{signInfo.symbol}</div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">{signInfo.name}</h2>
                <p className="text-gray-300 text-sm">{signInfo.dates}</p>
                <div className="flex gap-4 mt-2">
                  <span className="text-xs text-gray-400">Element: <strong className="text-amber-400">{signInfo.element}</strong></span>
                  <span className="text-xs text-gray-400">Ruler: <strong className="text-purple-400">{signInfo.ruler}</strong></span>
                </div>
              </div>
              <Button onClick={loadHoroscope} variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/20">
                <Sparkles className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Horoscope Content */}
        {loading ? (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="py-12 flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400 mb-4" />
              <p className="text-gray-300">Reading the stars...</p>
            </CardContent>
          </Card>
        ) : horoscope ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Overall Energy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200 leading-relaxed">{horoscope.overall}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-500/20 to-red-500/20 border-pink-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  ❤️ Love & Relationships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200 leading-relaxed">{horoscope.love}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  Career & Money
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200 leading-relaxed">{horoscope.career}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  🧘 Health & Wellness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200 leading-relaxed">{horoscope.health}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-white">🍀 Lucky Vibes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Lucky Numbers</p>
                    <div className="flex gap-2 flex-wrap">
                      {horoscope.luckyNumbers?.map((num, i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 font-bold">
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Lucky Colors</p>
                    <div className="flex gap-2 flex-wrap">
                      {horoscope.luckyColors?.map((color, i) => (
                        <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-gray-200 text-sm capitalize">
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}