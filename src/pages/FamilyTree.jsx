import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Printer, Sparkles, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import NumberBadge from '../components/legacy/NumberBadge';
import { numerologyMeanings } from '../components/legacy/numerologyData';

export default function FamilyTree() {
  const [selectedNumber, setSelectedNumber] = useState(null);

  const generations = [
    {
      title: 'Great-Grandparents Generation (Born 1900s-1910s)',
      color: 'from-slate-600 to-slate-700',
      members: [
        {
          name: 'Thomas Francis Maher',
          born: 'May 5, 1910',
          lifePath: 3,
          expression: 11,
          soulUrge: 5,
          personality: 6,
          birthday: '5',
          role: 'The Creative Visionary',
          masters: [3, 11, 5],
          sign: 'Taurus / Earth'
        },
        {
          name: 'George Shotts Wilson',
          born: 'October 23, 1903',
          lifePath: 1,
          expression: 7,
          soulUrge: 6,
          personality: 1,
          birthday: '23/5',
          role: 'The Independent Seeker',
          masters: [1, 7, 6],
          sign: 'Scorpio / Water'
        }
      ]
    },
    {
      title: 'Grandparents Generation (Born 1940s)',
      color: 'from-blue-600 to-cyan-600',
      members: [
        {
          name: 'John Francis Maher',
          born: 'December 22',
          lifePath: 7,
          expression: 9,
          soulUrge: 22,
          personality: 5,
          birthday: '22',
          role: 'The Master Builder',
          masters: [7, 11, 22, 9],
          sign: 'Sagittarius / Fire-Water'
        },
        {
          name: 'Elizabeth JoAnn Maher',
          born: 'July 8',
          lifePath: 6,
          expression: 7,
          soulUrge: '33/6',
          personality: 1,
          birthday: '26/8',
          role: 'The Master Healer',
          masters: [6, 7, 8, 33],
          sign: 'Cancer / Water-Earth'
        },
        {
          name: 'Elizabeth Elanor Wilson',
          born: 'August 17, 1912',
          lifePath: 2,
          expression: 6,
          soulUrge: '33/6',
          personality: 3,
          birthday: '17/8',
          role: 'The Harmonizer & Teacher',
          masters: [2, 6, 8, 33],
          sign: 'Leo / Fire-Water'
        }
      ]
    },
    {
      title: 'Parents Generation (Born 1970s)',
      color: 'from-purple-600 to-pink-600',
      members: [
        {
          name: 'Stephen Maher',
          born: 'November 7',
          lifePath: 7,
          expression: 11,
          soulUrge: 8,
          personality: 9,
          birthday: '7',
          role: 'The Bridge',
          masters: [7, 8, 9, 11],
          sign: 'Scorpio / Water-Air'
        },
        {
          name: 'Amy Maher',
          born: 'December 27',
          lifePath: 11,
          expression: 5,
          soulUrge: 8,
          personality: 6,
          birthday: '27/9',
          role: 'The Activator',
          masters: [11, 8, 6],
          sign: 'Capricorn / Earth'
        }
      ]
    },
    {
      title: 'Children Generation (Born 1990s-2000s)',
      color: 'from-amber-500 to-orange-600',
      members: [
        {
          name: 'Christian Stephen Maher',
          born: 'October 25',
          lifePath: 8,
          expression: 8,
          soulUrge: 11,
          personality: 6,
          birthday: '25/7',
          role: 'The Master Builder',
          masters: [8, 7, 11],
          sign: 'Scorpio / Water-Earth'
        },
        {
          name: 'Kyle Maher',
          lifePath: 5,
          expression: 8,
          soulUrge: 1,
          personality: 7,
          birthday: '19/1',
          role: 'The Adventurer',
          masters: [5, 7, 8, 1],
          sign: 'Cancer / Water-Fire'
        },
        {
          name: 'Melanie Maher',
          lifePath: 1,
          expression: 3,
          soulUrge: '33/6',
          personality: 6,
          birthday: '28/1',
          role: 'The Healer',
          masters: [1, 3, 6, 33],
          sign: 'Libra / Air-Earth'
        }
      ]
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  const parseNumber = (value) => {
    if (typeof value === 'string') {
      const parts = value.split('/');
      return parseInt(parts[parts.length - 1]);
    }
    return value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Link to={createPageUrl('Home')} className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-4 print:hidden">
            ← Back to Home
          </Link>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-12 h-12 text-amber-400" />
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              The Maher Family Tree
            </h1>
            <Sparkles className="w-12 h-12 text-amber-400" />
          </div>
          <p className="text-xl text-gray-300 italic mb-4">
            Four Generations of Numerological Wisdom
          </p>
          <p className="text-lg text-gray-400 mb-8">
            From the great-grandparents to the children—a legacy of master numbers flowing through time
          </p>
          <Button
            onClick={handlePrint}
            className="print:hidden bg-amber-600 hover:bg-amber-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Family Tree
          </Button>
        </div>

        {/* Generation Flow */}
        <div className="space-y-12">
          {generations.map((generation, genIdx) => (
            <div key={genIdx}>
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold bg-gradient-to-r ${generation.color} bg-clip-text text-transparent mb-2`}>
                  {generation.title}
                </h2>
                {genIdx < generations.length - 1 && (
                  <ArrowDown className="w-8 h-8 text-amber-400 mx-auto mt-4 animate-bounce" />
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {generation.members.map((member, idx) => (
                  <div
                    key={idx}
                    className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-6 hover:scale-105 transition-transform"
                  >
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${generation.color} flex items-center justify-center mb-4 mx-auto`}>
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white text-center mb-1">
                      {member.name}
                    </h3>
                    {member.born && (
                      <p className="text-sm text-gray-400 text-center mb-3">Born: {member.born}</p>
                    )}
                    <p className={`text-center text-sm font-semibold bg-gradient-to-r ${generation.color} bg-clip-text text-transparent mb-4`}>
                      {member.role}
                    </p>

                    {/* Core Numbers */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Life Path:</span>
                        <NumberBadge number={member.lifePath} onClick={setSelectedNumber} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Expression:</span>
                        <NumberBadge number={member.expression} onClick={setSelectedNumber} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Soul Urge:</span>
                        <NumberBadge number={parseNumber(member.soulUrge)} onClick={setSelectedNumber} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Birthday:</span>
                        <span className="text-gray-400 text-sm">{member.birthday}</span>
                      </div>
                    </div>

                    {/* Master Numbers */}
                    <div className="pt-4 border-t border-white/20">
                      <p className="text-xs text-gray-400 mb-2 text-center">Master Numbers</p>
                      <div className="flex gap-1 flex-wrap justify-center">
                        {member.masters.map((num, i) => (
                          <NumberBadge key={i} number={num} onClick={setSelectedNumber} size="sm" />
                        ))}
                      </div>
                    </div>

                    {/* Sign */}
                    <p className="text-xs text-gray-400 text-center mt-3">{member.sign}</p>
                  </div>
                ))}
              </div>

              {genIdx < generations.length - 1 && (
                <div className="flex justify-center mb-8">
                  <div className="h-12 w-1 bg-gradient-to-b from-amber-400 to-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legacy Summary */}
        <div className="mt-16 p-8 bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">The Legacy Flow</h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              <strong className="text-amber-400">The 7</strong> flows from Thomas Francis through John Francis and Stephen to Christian—
              a direct line of wisdom-seekers and analysts spanning four generations.
            </p>
            <p>
              <strong className="text-purple-400">The 11</strong> appears powerfully in Thomas Francis, John Francis, Stephen, Amy, and Christian—
              creating a master channel of intuition and visionary gifts.
            </p>
            <p>
              <strong className="text-pink-400">The 33/6</strong> connects Elizabeth Elanor Wilson through Elizabeth JoAnn to Melanie—
              an unbroken chain of master healers and teachers across three generations.
            </p>
            <p>
              <strong className="text-orange-400">The 8</strong> pulses through Christian (double 8), Kyle, and multiple ancestors—
              the family's collective power to achieve and build lasting impact.
            </p>
          </div>
        </div>
      </div>

      {/* Number Explanation Modal */}
      <Dialog open={!!selectedNumber} onOpenChange={() => setSelectedNumber(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold">
                {selectedNumber}
              </span>
              {numerologyMeanings[selectedNumber]?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">General Meaning</h3>
              <p className="text-gray-700 leading-relaxed">{numerologyMeanings[selectedNumber]?.meaning}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">In the Maher Family</h3>
              <p className="text-gray-700 leading-relaxed">{numerologyMeanings[selectedNumber]?.familyContext}</p>
            </div>
            {numerologyMeanings[selectedNumber]?.keywords && (
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Key Traits</h3>
                <div className="flex flex-wrap gap-2">
                  {numerologyMeanings[selectedNumber].keywords.map((keyword, idx) => (
                    <span key={idx} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
          @page { margin: 1cm; }
        }
      `}</style>
    </div>
  );
}