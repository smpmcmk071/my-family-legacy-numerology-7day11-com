import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Printer, ArrowLeft, Users, Loader2, Sparkles } from 'lucide-react';
import { numerologyMeanings } from '../components/legacy/numerologyData';

const MASTER_NUMBERS = [11, 22, 33, 44, 55, 66, 77, 88, 99];

const generationLabels = {
  1: 'Great-Grandparents',
  2: 'Grandparents',
  3: 'Parents',
  4: 'Children',
  5: 'Grandchildren',
  0: 'Unassigned',
};

function NumberChip({ number, highlight }) {
  if (!number && number !== 0) return <span className="text-gray-300">—</span>;
  const isMaster = MASTER_NUMBERS.includes(Number(number));
  return (
    <span
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold border-2 ${
        isMaster
          ? 'border-amber-500 bg-amber-50 text-amber-700 print:border-black print:bg-white print:text-black'
          : highlight
          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 print:border-black print:bg-white print:text-black'
          : 'border-gray-300 bg-white text-gray-700 print:border-black'
      }`}
    >
      {number}
    </span>
  );
}

export default function FamilyMasterNumberMap() {
  const [family, setFamily] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFamilyData();
  }, []);

  const loadFamilyData = async () => {
    setLoading(true);
    const user = await base44.auth.me();
    let memberRecord = await base44.entities.FamilyMember.filter({ email: user.email });
    let selfMember = memberRecord.find((m) => m.relationship === 'self') || memberRecord[0];
    if (!selfMember) {
      const createdMembers = await base44.entities.FamilyMember.filter({ created_by: user.email });
      selfMember = createdMembers[0];
    }
    if (selfMember?.family_id) {
      const families = await base44.entities.Family.filter({ id: selfMember.family_id });
      if (families.length > 0) {
        setFamily(families[0]);
        const familyMembers = await base44.entities.FamilyMember.filter({ family_id: selfMember.family_id });
        familyMembers.sort((a, b) => {
          const genA = a.generation || 99;
          const genB = b.generation || 99;
          if (genA !== genB) return genA - genB;
          return new Date(a.created_date) - new Date(b.created_date);
        });
        setMembers(familyMembers);
      }
    }
    setLoading(false);
  };

  const handlePrint = () => window.print();

  // Count master numbers across the family
  const masterCounts = {};
  const memberMasterMap = {}; // member.id -> [master numbers]
  members.forEach((m) => {
    const masters = [];
    if (m.master_numbers) {
      m.master_numbers
        .split(',')
        .map((n) => parseInt(n.trim(), 10))
        .filter(Boolean)
        .forEach((n) => {
          masters.push(n);
          masterCounts[n] = (masterCounts[n] || 0) + 1;
        });
    }
    // Also flag core numbers that are themselves master numbers
    [m.life_path_western, m.expression_western, m.soul_urge_western, m.personality_western].forEach((n) => {
      if (n && MASTER_NUMBERS.includes(Number(n))) {
        masterCounts[n] = (masterCounts[n] || 0) + 1;
      }
    });
    memberMasterMap[m.id] = masters;
  });

  const presentMasters = Object.keys(masterCounts)
    .map(Number)
    .sort((a, b) => a - b);

  // Group by generation
  const generations = {};
  members.forEach((m) => {
    const gen = m.generation || 0;
    if (!generations[gen]) generations[gen] = [];
    generations[gen].push(m);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!family) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Family Found</h2>
            <p className="text-gray-600 mb-4">Add yourself as a family member to create your master number map.</p>
            <Link to={createPageUrl('AddFamilyMember')}>
              <Button className="bg-amber-600 hover:bg-amber-700">Get Started</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto bg-white shadow-xl print:shadow-none print:max-w-none">
        {/* Print-only report header */}
        <div className="hidden print:block text-center py-6 border-b-2 border-black">
          <h1 className="text-3xl font-bold">{family.name} — Master Number Map</h1>
          <p className="text-sm mt-1">Family Numerological Legacy Report • Generated {today}</p>
        </div>

        {/* Screen header with controls */}
        <div className="p-6 print:hidden">
          <div className="flex items-center justify-between mb-6">
            <Link to={createPageUrl('Home')} className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <Button onClick={handlePrint} className="bg-amber-600 hover:bg-amber-700">
              <Printer className="w-4 h-4 mr-2" />
              Print / Save PDF
            </Button>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sparkles className="w-7 h-7 text-amber-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {family.name} — Master Number Map
              </h1>
              <Sparkles className="w-7 h-7 text-amber-600" />
            </div>
            <p className="text-gray-600">A clean, printable map of your family's numerological legacy.</p>
          </div>
        </div>

        {/* Report body */}
        <div className="px-6 md:px-10 pb-10 print:px-8 print:pb-6">
          {/* Master number summary */}
          <section className="mb-8 print:break-inside-avoid">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">
              Family Master Number Summary
            </h2>
            {presentMasters.length === 0 ? (
              <p className="text-gray-600 italic">
                No master numbers (11, 22, 33, 44…) currently appear across {family.name}.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {presentMasters.map((num) => (
                  <div
                    key={num}
                    className="flex items-center gap-3 p-3 border-2 border-amber-400 bg-amber-50 rounded-lg print:border-black print:bg-white"
                  >
                    <NumberChip number={num} highlight />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {numerologyMeanings[num]?.title || `Master ${num}`}
                      </p>
                      <p className="text-xs text-gray-600">{masterCounts[num]} occurrence{masterCounts[num] > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Member map table */}
          <section className="print:break-inside-auto">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">
              Member Core Numbers & Master Numbers
            </h2>
            {Object.entries(generations)
              .filter(([gen]) => gen !== '0')
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([gen, genMembers]) => (
                <div key={gen} className="mb-6 print:break-inside-avoid">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">
                    {generationLabels[gen] || `Generation ${gen}`}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-100 print:bg-white">
                          <th className="text-left p-2 border border-gray-300 print:border-black font-semibold">Member</th>
                          <th className="text-center p-2 border border-gray-300 print:border-black font-semibold">Life Path</th>
                          <th className="text-center p-2 border border-gray-300 print:border-black font-semibold">Expression</th>
                          <th className="text-center p-2 border border-gray-300 print:border-black font-semibold">Soul Urge</th>
                          <th className="text-center p-2 border border-gray-300 print:border-black font-semibold">Personality</th>
                          <th className="text-center p-2 border border-gray-300 print:border-black font-semibold">Master #s</th>
                        </tr>
                      </thead>
                      <tbody>
                        {genMembers.map((m) => (
                          <tr key={m.id} className="break-inside-avoid">
                            <td className="p-2 border border-gray-300 print:border-black">
                              <p className="font-semibold text-gray-900">{m.full_name}</p>
                              <p className="text-xs text-gray-500 capitalize">{m.relationship || ''}</p>
                              {m.sun_sign && <p className="text-xs text-gray-500">{m.sun_sign}</p>}
                            </td>
                            <td className="text-center p-2 border border-gray-300 print:border-black">
                              <div className="flex flex-col items-center gap-1">
                                <NumberChip number={m.life_path_western} highlight={MASTER_NUMBERS.includes(Number(m.life_path_western))} />
                                {m.life_path_master && m.life_path_master !== String(m.life_path_western) && (
                                  <span className="text-[10px] text-gray-400">{m.life_path_master}</span>
                                )}
                              </div>
                            </td>
                            <td className="text-center p-2 border border-gray-300 print:border-black">
                              <div className="flex flex-col items-center gap-1">
                                <NumberChip number={m.expression_western} highlight={MASTER_NUMBERS.includes(Number(m.expression_western))} />
                                {m.expression_master && m.expression_master !== String(m.expression_western) && (
                                  <span className="text-[10px] text-gray-400">{m.expression_master}</span>
                                )}
                              </div>
                            </td>
                            <td className="text-center p-2 border border-gray-300 print:border-black">
                              <div className="flex flex-col items-center gap-1">
                                <NumberChip number={m.soul_urge_western} highlight={MASTER_NUMBERS.includes(Number(m.soul_urge_western))} />
                                {m.soul_urge_master && m.soul_urge_master !== String(m.soul_urge_western) && (
                                  <span className="text-[10px] text-gray-400">{m.soul_urge_master}</span>
                                )}
                              </div>
                            </td>
                            <td className="text-center p-2 border border-gray-300 print:border-black">
                              <div className="flex flex-col items-center gap-1">
                                <NumberChip number={m.personality_western} highlight={MASTER_NUMBERS.includes(Number(m.personality_western))} />
                                {m.personality_master && m.personality_master !== String(m.personality_western) && (
                                  <span className="text-[10px] text-gray-400">{m.personality_master}</span>
                                )}
                              </div>
                            </td>
                            <td className="text-center p-2 border border-gray-300 print:border-black">
                              {memberMasterMap[m.id].length > 0 ? (
                                <div className="flex flex-wrap gap-1 justify-center">
                                  {memberMasterMap[m.id].map((n, i) => (
                                    <NumberChip key={i} number={n} highlight />
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

            {generations[0]?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">Unassigned</h3>
                <p className="text-sm text-gray-600">
                  {generations[0].map((m) => m.full_name).join(', ')}
                </p>
              </div>
            )}
          </section>

          {/* Master number legend */}
          <section className="mt-8 print:break-inside-avoid">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">
              Master Number Key
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {presentMasters.length > 0
                ? presentMasters.map((num) => (
                    <div key={num} className="flex gap-3 p-3 border border-gray-200 rounded-lg print:border-black">
                      <NumberChip number={num} highlight />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {numerologyMeanings[num]?.title || `Master ${num}`}
                        </p>
                        <p className="text-xs text-gray-600 leading-snug">
                          {numerologyMeanings[num]?.meaning || 'A powerful master vibration.'}
                        </p>
                      </div>
                    </div>
                  ))
                : [11, 22, 33].map((num) => (
                    <div key={num} className="flex gap-3 p-3 border border-gray-200 rounded-lg print:border-black">
                      <NumberChip number={num} highlight />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {numerologyMeanings[num]?.title || `Master ${num}`}
                        </p>
                        <p className="text-xs text-gray-600 leading-snug">
                          {numerologyMeanings[num]?.meaning || 'A powerful master vibration.'}
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-10 pt-4 border-t border-gray-300 text-center text-xs text-gray-500 print:border-black">
            <p className="font-semibold text-gray-700">{family.name}</p>
            <p>Family Master Number Map • {today}</p>
            <p className="mt-1 italic">Generated by 7day11.com</p>
          </footer>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white; }
          @page { margin: 1.5cm; }
          table { font-size: 11px; }
        }
      `}</style>
    </div>
  );
}