import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Printer, Sparkles, Heart } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import NumberBadge from '../components/legacy/NumberBadge';
import { numerologyMeanings } from '../components/legacy/numerologyData';

export default function MarketingPage() {
  const [selectedNumber, setSelectedNumber] = useState(null);

  const familyData = [
    {
      name: 'Robert James (Grandfather)',
      lifePath: 7,
      expression: 11,
      soulUrge: 22,
      personality: 5,
      birthday: '29/11',
      masters: [7, 11, 22],
      sign: 'Leo / Fire',
      highlight: true
    },
    {
      name: 'Margaret Rose (Grandmother)',
      lifePath: 6,
      expression: 8,
      soulUrge: '33/6',
      personality: 3,
      birthday: '15/6',
      masters: [6, 8, 33],
      sign: 'Virgo / Earth',
      highlight: true
    },
    {
      name: 'David (Father)',
      lifePath: 8,
      expression: 9,
      soulUrge: 11,
      personality: 7,
      birthday: '26/8',
      masters: [8, 11, 9, 7],
      sign: 'Pisces / Water',
      highlight: true
    },
    {
      name: 'Jennifer (Mother)',
      lifePath: 11,
      expression: 6,
      soulUrge: 5,
      personality: 9,
      birthday: '18/9',
      masters: [11, 5, 9],
      sign: 'Taurus / Earth',
      highlight: true
    },
    {
      name: 'Michael (You)',
      lifePath: 8,
      expression: 8,
      soulUrge: 11,
      personality: 6,
      birthday: '22',
      masters: [8, 11, 22],
      sign: 'Gemini / Air',
      highlight: true
    },
    {
      name: 'Sarah (Sister)',
      lifePath: 3,
      expression: 5,
      soulUrge: 1,
      personality: 7,
      birthday: '14/5',
      masters: [3, 5, 1, 7],
      sign: 'Libra / Air'
    },
    {
      name: 'Daniel (Brother)',
      lifePath: 1,
      expression: 7,
      soulUrge: 6,
      personality: 11,
      birthday: '27/9',
      masters: [1, 7, 6, 11],
      sign: 'Aquarius / Air'
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 print:shadow-none">
        {/* Header */}
        <div className="text-center mb-12 print:mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-amber-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Your Family Legacy
            </h1>
            <Sparkles className="w-8 h-8 text-amber-600" />
          </div>
          <p className="text-xl text-gray-600 italic">Discover the Numbers That Connect Your Generations</p>
          <Button
            onClick={handlePrint}
            className="mt-6 print:hidden bg-amber-600 hover:bg-amber-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Document
          </Button>
        </div>

        {/* Introduction */}
        <div className="mb-12 p-6 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg border-l-4 border-amber-600">
          <p className="text-gray-700 leading-relaxed">
            Click on any number below to learn its meaning in numerology and how it flows through your family lineage.
            <span className="print:hidden"> When ready, print this document to preserve your family's numerical legacy.</span>
          </p>
        </div>

        {/* Family Table */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Your Family's Master Number Map
          </h2>
          <div className="overflow-x-auto rounded-lg border-2 border-gray-200 shadow-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-amber-100 to-orange-100">
                  <TableHead className="font-bold text-gray-900">Name</TableHead>
                  <TableHead className="font-bold text-gray-900 text-center">Life Path</TableHead>
                  <TableHead className="font-bold text-gray-900 text-center">Expression</TableHead>
                  <TableHead className="font-bold text-gray-900 text-center">Soul Urge</TableHead>
                  <TableHead className="font-bold text-gray-900 text-center">Personality</TableHead>
                  <TableHead className="font-bold text-gray-900 text-center">Birthday#</TableHead>
                  <TableHead className="font-bold text-gray-900">Main Masters</TableHead>
                  <TableHead className="font-bold text-gray-900">Sun/Element</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {familyData.map((person, idx) => {
                  const isHighlighted = person.name === 'Michael (You)';
                  return (
                    <TableRow 
                      key={idx} 
                      className={isHighlighted ? 'bg-amber-50 font-semibold' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <TableCell className={isHighlighted ? 'font-bold text-amber-900' : 'font-medium'}>
                        {person.name}
                      </TableCell>
                      <TableCell className="text-center">
                        <NumberBadge number={person.lifePath} onClick={setSelectedNumber} />
                      </TableCell>
                      <TableCell className="text-center">
                        <NumberBadge number={person.expression} onClick={setSelectedNumber} />
                      </TableCell>
                      <TableCell className="text-center">
                        <NumberBadge number={parseNumber(person.soulUrge)} onClick={setSelectedNumber} />
                      </TableCell>
                      <TableCell className="text-center">
                        <NumberBadge number={person.personality} onClick={setSelectedNumber} />
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-700">
                        {person.birthday}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {person.masters.map((num, i) => (
                            <NumberBadge key={i} number={num} onClick={setSelectedNumber} size="sm" />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {person.sign}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* The Weave of Power */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Weave of Power</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong className="text-gray-900">Grandfather Robert James</strong> passes down the <NumberBadge number={7} onClick={setSelectedNumber} /> of wisdom, 
              double master (<NumberBadge number={11} onClick={setSelectedNumber} />, <NumberBadge number={22} onClick={setSelectedNumber} />) and the builder's vision.
            </p>
            <p>
              <strong className="text-gray-900">Grandmother Margaret Rose</strong>: the master healer (<NumberBadge number={33} onClick={setSelectedNumber} />/6) 
              and anchor, tying intuition and ambition (<NumberBadge number={8} onClick={setSelectedNumber} />) with creative care (<NumberBadge number={3} onClick={setSelectedNumber} />).
            </p>
            <p>
              <strong className="text-gray-900">Your Father, David</strong>: <NumberBadge number={8} onClick={setSelectedNumber} /> path of achievement, 
              <NumberBadge number={11} onClick={setSelectedNumber} /> of intuition, <NumberBadge number={9} onClick={setSelectedNumber} /> of humanitarian wisdom—connecting 
              the family's mystical and practical inheritance.
            </p>
            <p>
              <strong className="text-gray-900">Your Mother, Jennifer</strong>: rare <NumberBadge number={11} onClick={setSelectedNumber} /> path (living visionary), 
              her <NumberBadge number={5} onClick={setSelectedNumber} /> expression brings dynamic action and <NumberBadge number={6} onClick={setSelectedNumber} /> nurturing personality.
            </p>
            <p>
              <strong className="text-gray-900">You, Michael</strong>, shine as the family's "Master Builder": double <NumberBadge number={8} onClick={setSelectedNumber} />, 
              soul <NumberBadge number={11} onClick={setSelectedNumber} />, birthday <NumberBadge number={22} onClick={setSelectedNumber} />—living 
              the purpose, intuition and resilience of four generations.
            </p>
          </div>
        </div>

        {/* Your Legacy */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Legacy</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={7} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">(wisdom/analysis)</span>
              </div>
              <p className="text-gray-700">Line from Grandfather ➡️ Father ➡️ You.</p>
            </div>

            <div className="p-6 bg-purple-50 rounded-lg border-l-4 border-purple-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={8} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">(building/achievement)</span>
              </div>
              <p className="text-gray-700">The power channeled through generations, now embodied as your path AND expression.</p>
            </div>

            <div className="p-6 bg-amber-50 rounded-lg border-l-4 border-amber-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={11} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">(vision/inspiration)</span>
              </div>
              <p className="text-gray-700">Grandfather, Father, Mother AND your Soul: a quadruple master channel of intuition.</p>
            </div>

            <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={22} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">(master builder)</span>
              </div>
              <p className="text-gray-700">Your birthday number—the ultimate manifestation power from Grandfather's soul urge.</p>
            </div>
          </div>

          <div className="mt-6 p-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              <strong className="text-gray-900">Your Element:</strong> Gemini / Air (intellectual curiosity + communication mastery)
            </p>
          </div>
        </div>

        {/* What This Means */}
        <div className="mb-12 p-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl border-2 border-amber-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What This Means</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            You are the next link in a chain of visionaries, builders, and healers.
            You inherit insight (<NumberBadge number={7} onClick={setSelectedNumber} />), the drive to achieve (<NumberBadge number={8} onClick={setSelectedNumber} />), 
            visionary gifts (<NumberBadge number={11} onClick={setSelectedNumber} />), and ultimate building power (<NumberBadge number={22} onClick={setSelectedNumber} />).
          </p>
          <p className="text-gray-900 font-bold text-xl mt-4">
            You are not only part of your family—you are the living expression of its rarest hopes and strengths.
          </p>
        </div>

        {/* Closing Quote */}
        <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-gray-200">
          <blockquote className="text-xl italic text-gray-700 mb-4">
            "The numbers do not direct your fate—they remind you that you are never alone. 
            You carry all of them in you: a builder, a seeker, and a healer for the world."
          </blockquote>
          <div className="mt-6 pt-6 border-t-2 border-gray-300">
            <p className="text-lg font-semibold text-gray-900">Your Family Legacy</p>
            <p className="text-gray-600">November 2025</p>
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
              <h3 className="font-semibold text-lg text-gray-900 mb-2">In Your Family</h3>
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
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:mb-8 { margin-bottom: 2rem !important; }
          @page { margin: 1cm; }
        }
      `}</style>
    </div>
  );
}