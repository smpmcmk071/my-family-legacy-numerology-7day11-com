import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Users, Loader2, AlertTriangle, MapPin, Clock, Globe, Compass, Sun, Moon } from 'lucide-react';
import ChartWheel from '@/components/astrology/ChartWheel';

const PLANET_GLYPHS = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇'
};

function elementColor(sign) {
  const fire = ['Aries', 'Leo', 'Sagittarius'];
  const earth = ['Taurus', 'Virgo', 'Capricorn'];
  const air = ['Gemini', 'Libra', 'Aquarius'];
  const water = ['Cancer', 'Scorpio', 'Pisces'];
  if (fire.includes(sign)) return 'text-red-300 bg-red-500/20 border-red-500/40';
  if (earth.includes(sign)) return 'text-green-300 bg-green-500/20 border-green-500/40';
  if (air.includes(sign)) return 'text-cyan-300 bg-cyan-500/20 border-cyan-500/40';
  if (water.includes(sign)) return 'text-blue-300 bg-blue-500/20 border-blue-500/40';
  return 'text-gray-300 bg-white/10 border-white/20';
}

export default function SiderealChart() {
  const [members, setMembers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasFamily, setHasFamily] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const user = await base44.auth.me();
        // find a family the user belongs to
        const own = await base44.entities.FamilyMember.filter({ email: user.email });
        let familyId = null;
        if (own.length > 0 && own[0].family_id) {
          familyId = own[0].family_id;
        } else {
          const fams = await base44.entities.Family.filter({ admin_email: user.email });
          if (fams.length > 0) familyId = fams[0].id;
        }
        if (!familyId) { setLoading(false); return; }
        setHasFamily(true);
        const mems = await base44.entities.FamilyMember.filter({ family_id: familyId });
        setMembers(mems);
        const urlParams = new URLSearchParams(window.location.search);
        const pre = urlParams.get('member');
        if (pre && mems.find(m => m.id === pre)) setSelectedId(pre);
        else if (mems.length > 0) setSelectedId(mems[0].id);
      } catch (e) {
        // ignore
      }
      setLoading(false);
    };
    load();
  }, []);

  const member = members.find(m => m.id === selectedId);
  let chart = null;
  let chartError = null;
  if (member?.sidereal_chart) {
    try { chart = JSON.parse(member.sidereal_chart); } catch (e) { chartError = 'Stored chart data was corrupt.'; }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center gap-2">
            <Compass className="w-7 h-7 text-amber-400" />
            Sidereal Birth Chart
          </h1>
          <p className="text-gray-300 mt-1 text-sm">Whole Sign houses · Lahiri ayanamsa · computed from real coordinates & time</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-amber-400" /></div>
        ) : !hasFamily ? (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="py-12 text-center">
              <Users className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <p className="text-white font-medium">No family found</p>
              <p className="text-gray-400 text-sm mt-1">Add a family member first to generate a chart.</p>
              <Link to="/AddFamilyMember"><Button className="mt-4 bg-amber-600 hover:bg-amber-700">Add Member</Button></Link>
            </CardContent>
          </Card>
        ) : members.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="py-12 text-center">
              <p className="text-white">No family members yet.</p>
              <Link to="/AddFamilyMember"><Button className="mt-4 bg-amber-600 hover:bg-amber-700">Add Member</Button></Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Member selector */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {members.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedId === m.id ? 'bg-amber-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {m.nickname || m.full_name.split(' ')[0]}
                </button>
              ))}
            </div>

            {!member ? null : !chart ? (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="py-10 text-center">
                  <AlertTriangle className="w-9 h-9 text-amber-400 mx-auto mb-3" />
                  <p className="text-white font-medium">No sidereal chart stored for {member.nickname || member.full_name}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Open this member in “Add Member”, re-enter the birth date, time and place, and save — the chart is calculated and stored automatically.
                  </p>
                  <Link to="/AddFamilyMember"><Button className="mt-4 bg-amber-600 hover:bg-amber-700">Go to Add Member</Button></Link>
                  {chartError && <p className="text-red-300 text-xs mt-3">{chartError}</p>}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-5">
                {/* Provenance / confidence banner */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-4">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                      <span className="text-white font-semibold text-lg">{member.full_name}</span>
                      <span className="text-amber-300">{chart.chart_standard}</span>
                      <span className="text-gray-400">Ayanamsa {chart.ayanamsa}°</span>
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-400 mt-2">
                      {chart.input?.birthPlace && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{chart.input.birthPlace}</span>}
                      {chart.input?.latitude != null && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{chart.input.latitude}, {chart.input.longitude}</span>}
                      {chart.input?.timezone && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{chart.input.timezone}</span>}
                    </div>
                    <div className={`mt-3 p-3 rounded-lg text-xs ${
                      chart.confidence?.ascendant_confident ? 'bg-green-500/15 text-green-200 border border-green-500/30'
                      : 'bg-amber-500/15 text-amber-200 border border-amber-500/30'
                    }`}>
                      {chart.confidence?.ascendant_confident
                        ? '✓ Reliable: exact birth time and resolved location — Ascendant and houses are dependable.'
                        : '⚠ Limited confidence: ' + (chart.confidence?.notes?.join(' ') || 'missing exact birth time or location.')}
                    </div>
                  </CardContent>
                </Card>

                {/* Visual house wheel */}
                {chart.houses ? (
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader><CardTitle className="text-white text-base flex items-center gap-2"><Compass className="w-4 h-4 text-amber-400" />Whole Sign House Wheel</CardTitle></CardHeader>
                    <CardContent>
                      <ChartWheel chart={chart} member={member} />
                    </CardContent>
                  </Card>
                ) : null}

                {/* Big three */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader><CardTitle className="text-white text-base">The Big Three</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      <BigThree label="Ascendant" icon={<Compass className="w-4 h-4" />} data={chart.ascendant} />
                      <BigThree label="Sun" icon={<Sun className="w-4 h-4" />} data={chart.planets?.find(p => p.key === 'Sun')} />
                      <BigThree label="Moon" icon={<Moon className="w-4 h-4" />} data={chart.planets?.find(p => p.key === 'Moon')} />
                    </div>
                  </CardContent>
                </Card>

                {/* Planets */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader><CardTitle className="text-white text-base">Planetary Placements</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {chart.planets?.map(p => (
                        <div key={p.key} className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl">{p.glyph}</span>
                            {p.house != null && <span className="text-xs text-gray-400">H{p.house}</span>}
                          </div>
                          <p className="text-white text-sm font-medium mt-1">{p.name}</p>
                          <p className={`text-xs px-2 py-0.5 rounded inline-block border ${elementColor(p.sign)}`}>
                            {p.signGlyph} {p.sign} {p.degreeInSign.toFixed(1)}°
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Houses */}
                {chart.houses ? (
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader><CardTitle className="text-white text-base">The Twelve Houses (Whole Sign)</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {chart.houses.map(h => (
                          <div key={h.house} className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-amber-300 font-semibold">House {h.house}</span>
                              <span className={`text-xs px-2 py-0.5 rounded border ${elementColor(h.sign)}`}>
                                {h.signGlyph} {h.sign}
                              </span>
                            </div>
                            <p className="text-xs text-gray-300">{h.meaning}</p>
                            {h.planets?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {h.planets.map(pl => (
                                  <span key={pl.key} className="text-xs px-1.5 py-0.5 bg-white/10 rounded" title={`${pl.name} ${pl.sign} ${pl.degreeInSign}°`}>
                                    {pl.glyph} {pl.name} {pl.degreeInSign.toFixed(0)}°
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-3">
                        Midheaven: {chart.midheaven?.signGlyph} {chart.midheaven?.sign} {chart.midheaven?.degreeInSign?.toFixed(1)}° ·
                        Ephemeris: {chart.ephemeris}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="py-6 text-center text-gray-400 text-sm">
                      Houses unavailable — birth time or location was missing for this member.
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function BigThree({ label, icon, data }) {
  if (!data) return (
    <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-center">
      <div className="flex items-center justify-center gap-1 text-gray-400 text-xs">{icon}{label}</div>
      <p className="text-gray-500 mt-1">—</p>
    </div>
  );
  return (
    <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-center">
      <div className="flex items-center justify-center gap-1 text-gray-400 text-xs">{icon}{label}</div>
      <p className="text-3xl my-1">{data.signGlyph}</p>
      <p className={`text-sm font-medium px-2 py-0.5 rounded inline-block border ${elementColor(data.sign)}`}>
        {data.sign}
      </p>
      <p className="text-gray-400 text-xs mt-1">{data.degreeInSign?.toFixed(2)}°</p>
    </div>
  );
}