import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { Loader2, Heart, Briefcase, Users, Zap } from 'lucide-react';

const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', element: 'Fire', modality: 'Cardinal' },
  { name: 'Taurus', symbol: '♉', element: 'Earth', modality: 'Fixed' },
  { name: 'Gemini', symbol: '♊', element: 'Air', modality: 'Mutable' },
  { name: 'Cancer', symbol: '♋', element: 'Water', modality: 'Cardinal' },
  { name: 'Leo', symbol: '♌', element: 'Fire', modality: 'Fixed' },
  { name: 'Virgo', symbol: '♍', element: 'Earth', modality: 'Mutable' },
  { name: 'Libra', symbol: '♎', element: 'Air', modality: 'Cardinal' },
  { name: 'Scorpio', symbol: '♏', element: 'Water', modality: 'Fixed' },
  { name: 'Sagittarius', symbol: '♐', element: 'Fire', modality: 'Mutable' },
  { name: 'Capricorn', symbol: '♑', element: 'Earth', modality: 'Cardinal' },
  { name: 'Aquarius', symbol: '♒', element: 'Air', modality: 'Fixed' },
  { name: 'Pisces', symbol: '♓', element: 'Water', modality: 'Mutable' }
];

export default function ZodiacCompatibility() {
  const [sign1, setSign1] = useState('');
  const [sign2, setSign2] = useState('');
  const [compatibility, setCompatibility] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeCompatibility = async () => {
    if (!sign1 || !sign2) return;
    
    setLoading(true);
    try {
      const info1 = ZODIAC_SIGNS.find(s => s.name === sign1);
      const info2 = ZODIAC_SIGNS.find(s => s.name === sign2);

      const prompt = `Analyze zodiac compatibility between ${sign1} (${info1.element} ${info1.modality}) and ${sign2} (${info2.element} ${info2.modality}).

Provide detailed analysis:
- Overall compatibility score (1-10)
- Romantic compatibility
- Friendship potential
- Work/business partnership
- Communication style
- Strengths of pairing
- Potential challenges
- Advice for harmony

Be insightful, practical, and balanced.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            overallScore: { type: 'integer' },
            romantic: { type: 'string' },
            friendship: { type: 'string' },
            work: { type: 'string' },
            communication: { type: 'string' },
            strengths: { type: 'array', items: { type: 'string' } },
            challenges: { type: 'array', items: { type: 'string' } },
            advice: { type: 'string' }
          }
        }
      });

      setCompatibility(response);
    } catch (error) {
      console.error('Failed to analyze compatibility:', error);
    }
    setLoading(false);
  };

  const sign1Info = ZODIAC_SIGNS.find(s => s.name === sign1);
  const sign2Info = ZODIAC_SIGNS.find(s => s.name === sign2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Zodiac Compatibility</h1>
          <p className="text-gray-300">Discover cosmic connections between signs</p>
        </div>

        {/* Sign Selectors */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">First Sign</label>
                <Select value={sign1} onValueChange={setSign1}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select a sign" />
                  </SelectTrigger>
                  <SelectContent>
                    {ZODIAC_SIGNS.map(sign => (
                      <SelectItem key={sign.name} value={sign.name}>
                        {sign.symbol} {sign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {sign1Info && (
                  <div className="mt-2 flex gap-2">
                    <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">{sign1Info.element}</span>
                    <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">{sign1Info.modality}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">Second Sign</label>
                <Select value={sign2} onValueChange={setSign2}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select a sign" />
                  </SelectTrigger>
                  <SelectContent>
                    {ZODIAC_SIGNS.map(sign => (
                      <SelectItem key={sign.name} value={sign.name}>
                        {sign.symbol} {sign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {sign2Info && (
                  <div className="mt-2 flex gap-2">
                    <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">{sign2Info.element}</span>
                    <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">{sign2Info.modality}</span>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={analyzeCompatibility}
              disabled={!sign1 || !sign2 || loading}
              className="w-full mt-6 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  Analyze Compatibility
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {compatibility && (
          <div className="space-y-6">
            {/* Score */}
            <Card className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-pink-500/30">
              <CardContent className="p-8 text-center">
                <div className="text-6xl font-bold text-white mb-2">{compatibility.overallScore}/10</div>
                <p className="text-gray-300">Overall Compatibility Score</p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="text-3xl">{sign1Info?.symbol}</span>
                  <Heart className="w-6 h-6 text-pink-400" />
                  <span className="text-3xl">{sign2Info?.symbol}</span>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-400" />
                    Romantic
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200 text-sm leading-relaxed">{compatibility.romantic}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    Friendship
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200 text-sm leading-relaxed">{compatibility.friendship}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-amber-400" />
                    Work Partnership
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200 text-sm leading-relaxed">{compatibility.work}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-400" />
                    Communication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200 text-sm leading-relaxed">{compatibility.communication}</p>
                </CardContent>
              </Card>
            </div>

            {/* Strengths & Challenges */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white">✨ Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {compatibility.strengths?.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">•</span>
                        <span className="text-gray-200 text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30">
                <CardHeader>
                  <CardTitle className="text-white">⚠️ Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {compatibility.challenges?.map((challenge, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-orange-400 mt-0.5">•</span>
                        <span className="text-gray-200 text-sm">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Advice */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">💡 Advice for Harmony</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200 leading-relaxed">{compatibility.advice}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}