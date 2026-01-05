import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Loader2, Zap, AlertCircle, TrendingUp, RefreshCw } from 'lucide-react';

const PLANETS = [
  { name: 'Mercury', symbol: '☿', retrogradeFreq: '3-4 times/year', themes: 'Communication, technology, travel' },
  { name: 'Venus', symbol: '♀', retrogradeFreq: 'Every 18 months', themes: 'Love, money, beauty, relationships' },
  { name: 'Mars', symbol: '♂', retrogradeFreq: 'Every 2 years', themes: 'Energy, action, conflict, passion' },
  { name: 'Jupiter', symbol: '♃', retrogradeFreq: 'Annually', themes: 'Growth, luck, expansion, wisdom' },
  { name: 'Saturn', symbol: '♄', retrogradeFreq: 'Annually', themes: 'Discipline, karma, structure, lessons' },
  { name: 'Uranus', symbol: '♅', retrogradeFreq: 'Annually', themes: 'Revolution, change, innovation' },
  { name: 'Neptune', symbol: '♆', retrogradeFreq: 'Annually', themes: 'Dreams, illusions, spirituality' },
  { name: 'Pluto', symbol: '♇', retrogradeFreq: 'Annually', themes: 'Transformation, power, rebirth' }
];

export default function PlanetaryTransits() {
  const [transits, setTransits] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTransits();
  }, []);

  const loadTransits = async () => {
    setLoading(true);
    try {
      const prompt = `Provide current planetary transit information for ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.

For each major planet (Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto):
- Current zodiac sign position
- Whether it's direct or retrograde
- Key themes and influences
- Practical guidance

Focus on the outer planets (Jupiter-Pluto) for longer-term influences and inner planets (Mercury-Mars) for immediate energies.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            overview: { type: 'string' },
            planets: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  sign: { type: 'string' },
                  status: { type: 'string' },
                  influence: { type: 'string' },
                  guidance: { type: 'string' }
                }
              }
            },
            importantDates: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  date: { type: 'string' },
                  event: { type: 'string' },
                  impact: { type: 'string' }
                }
              }
            }
          }
        }
      });

      setTransits(response);
    } catch (error) {
      console.error('Failed to load transits:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Planetary Transits</h1>
          <p className="text-gray-300">Current cosmic movements and their influence</p>
        </div>

        <div className="flex justify-end mb-6">
          <Button onClick={loadTransits} variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/20">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Transits
          </Button>
        </div>

        {loading ? (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="py-12 flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400 mb-4" />
              <p className="text-gray-300">Calculating planetary positions...</p>
            </CardContent>
          </Card>
        ) : transits ? (
          <div className="space-y-6">
            {/* Overview */}
            <Card className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  Cosmic Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200 leading-relaxed">{transits.overview}</p>
              </CardContent>
            </Card>

            {/* Planet Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {transits.planets?.map((transit, idx) => {
                const planetInfo = PLANETS.find(p => p.name === transit.name);
                const isRetrograde = transit.status?.toLowerCase().includes('retrograde');
                
                return (
                  <Card key={idx} className={`border-2 ${
                    isRetrograde 
                      ? 'bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/50' 
                      : 'bg-white/10 backdrop-blur-sm border-white/20'
                  }`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl">{planetInfo?.symbol}</div>
                          <div>
                            <CardTitle className="text-white">{transit.name}</CardTitle>
                            <p className="text-sm text-gray-400">in {transit.sign}</p>
                          </div>
                        </div>
                        {isRetrograde && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full">
                            <AlertCircle className="w-4 h-4 text-red-400" />
                            <span className="text-red-300 text-xs font-medium">Retrograde</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Current Influence</p>
                        <p className="text-gray-200 text-sm">{transit.influence}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Practical Guidance</p>
                        <p className="text-gray-300 text-sm">{transit.guidance}</p>
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-xs text-gray-500">{planetInfo?.themes}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Important Dates */}
            {transits.importantDates?.length > 0 && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                    Important Dates Ahead
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transits.importantDates.map((item, idx) => (
                      <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-start gap-3">
                          <div className="px-3 py-1 bg-amber-500/20 rounded-lg text-amber-300 text-xs font-medium whitespace-nowrap">
                            {item.date}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium mb-1">{item.event}</p>
                            <p className="text-gray-400 text-sm">{item.impact}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Retrograde Guide */}
            <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                  Understanding Retrogrades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200 text-sm leading-relaxed mb-4">
                  When planets appear to move backward in the sky (retrograde), their energies turn inward, prompting review and reflection rather than forward action.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {PLANETS.slice(0, 4).map(planet => (
                    <div key={planet.name} className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{planet.symbol}</span>
                        <div>
                          <p className="text-white font-medium text-sm">{planet.name}</p>
                          <p className="text-gray-400 text-xs">{planet.retrogradeFreq}</p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-xs">{planet.themes}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}