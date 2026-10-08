import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';

function fmt(p) {
  if (!p) return '—';
  return `${p.name} in ${p.sign} (${p.degreeInSign?.toFixed(1)}°) — House ${p.house ?? '?'}`;
}

function buildPrompt(member, chart, houseSystem) {
  const sys = houseSystem === 'placidus' ? 'Placidus' : 'Whole Sign';
  const planets = (chart.planets || []).map(fmt).join('\n');
  const asc = chart.ascendant
    ? `Ascendant: ${chart.ascendant.sign} (${chart.ascendant.degreeInSign?.toFixed(1)}°)`
    : 'Ascendant: unknown';
  const sun = chart.planets?.find(p => p.key === 'Sun');
  const moon = chart.planets?.find(p => p.key === 'Moon');

  return `You are an expert, warm sidereal astrologer (Lahiri ayanamsa, ${sys} houses).
A member of a family-legacy numerology app asked for help understanding their birth chart.
Write a clear, accessible interpretation in plain English — no jargon dumps, no fatalistic predictions, no medical/financial advice.
Use second person ("you"). Keep it encouraging and practical.

Member: ${member.full_name}.
Chart standard: ${chart.chart_standard}. Ayanamsa: ${chart.ayanamsa}°. House system: ${sys}.

Big Three:
- ${asc}
- ${fmt(sun)}
- ${fmt(moon)}

Planetary placements (sign, degree, house):
${planets}

Respond in Markdown with these sections, each a short paragraph or short bullets:
## Your Core Identity
(Sun, Moon, Ascendant and how they blend)
## Key Life Themes
(the houses holding the most planets, and what those life areas mean for you)
## Planetary Highlights
(2-3 standout placements and why they matter)
## Strengths & Growth Edges
## A Note to Remember
(one grounding sentence)
Keep the whole response under ~400 words.`;
}

export default function ChartAnalysis({ member, chart, houseSystem }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: buildPrompt(member, chart, houseSystem)
      });
      setAnalysis(typeof res === 'string' ? res : res?.data || res?.response || JSON.stringify(res));
    } catch (e) {
      setError(e?.message || 'Unable to generate analysis right now.');
    }
    setLoading(false);
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          AI Chart Analysis
          <span className="text-xs text-gray-400 font-normal ml-1">({houseSystem === 'placidus' ? 'Placidus' : 'Whole Sign'})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!analysis && !loading && !error && (
          <div className="text-center py-2">
            <p className="text-gray-300 text-sm mb-3">
              Get a plain-English reading of {member.full_name.split(' ')[0]}'s placements, key life themes, and growth edges.
            </p>
            <Button onClick={run} className="bg-amber-600 hover:bg-amber-700">
              <Sparkles className="w-4 h-4 mr-1" /> Generate Analysis
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-2 py-6 text-amber-200">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Reading the chart…</span>
          </div>
        )}

        {error && (
          <div className="text-red-300 text-sm text-center py-2">{error}</div>
        )}

        {analysis && !loading && (
          <>
            <div className="prose prose-invert prose-sm max-w-none text-gray-200 [&_h2]:text-amber-300 [&_h2]:mt-3 [&_h2]:mb-1 [&_h2]:text-base [&_strong]:text-white">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
            <div className="flex justify-end pt-2 border-t border-white/10">
              <Button size="sm" variant="outline" onClick={run}
                className="border-white/20 text-gray-200 hover:bg-white/10">
                <RefreshCw className="w-3.5 h-3.5 mr-1" /> Regenerate
              </Button>
            </div>
          </>
        )}

        <p className="text-[11px] text-gray-500">
          AI-generated interpretation for reflection only — not professional advice.
        </p>
      </CardContent>
    </Card>
  );
}