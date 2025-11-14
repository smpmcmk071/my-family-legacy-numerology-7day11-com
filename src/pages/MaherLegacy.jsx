import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Printer, Sparkles } from 'lucide-react';
import NumberBadge from '../components/legacy/NumberBadge';
import FamilyTable from '../components/legacy/FamilyTable';
import { numerologyMeanings } from '../components/legacy/numerologyData';

export default function MaherLegacy() {
  const [selectedNumber, setSelectedNumber] = useState(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 print:shadow-none">
        {/* Header */}
        <div className="text-center mb-12 print:mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-amber-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              The Maher Legacy
            </h1>
            <Sparkles className="w-8 h-8 text-amber-600" />
          </div>
          <p className="text-xl text-gray-600 italic">For Christian Stephen Maher</p>
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
            Click on any number below to learn its meaning in numerology and how it flows through the Maher family lineage.
            <span className="print:hidden"> When ready, print this document to preserve your family's numerical legacy.</span>
          </p>
        </div>

        {/* Family Table */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Our Family's Master Number Map
          </h2>
          <FamilyTable onNumberClick={setSelectedNumber} />
        </div>

        {/* The Weave of Power */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Weave of Power</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong className="text-gray-900">Grandpop John Francis</strong> passes down the <NumberBadge number={7} onClick={setSelectedNumber} /> of wisdom, 
              double master (<NumberBadge number={11} onClick={setSelectedNumber} />, <NumberBadge number={22} onClick={setSelectedNumber} />) and the builder's vision.
            </p>
            <p>
              <strong className="text-gray-900">Grandma Elizabeth JoAnn</strong>: the master healer (<NumberBadge number={33} onClick={setSelectedNumber} />/6) 
              and anchor, tying intuition (<NumberBadge number={7} onClick={setSelectedNumber} />) and ambition (<NumberBadge number={8} onClick={setSelectedNumber} />) with steady care.
            </p>
            <p>
              <strong className="text-gray-900">Your Dad, Stephen</strong>: <NumberBadge number={7} onClick={setSelectedNumber} /> path of the seeker, 
              <NumberBadge number={11} onClick={setSelectedNumber} /> of intuition, <NumberBadge number={8} onClick={setSelectedNumber} /> of power—connecting 
              the family's mystical and practical inheritance.
            </p>
            <p>
              <strong className="text-gray-900">Your Mom, Amy</strong>: rare <NumberBadge number={11} onClick={setSelectedNumber} /> path (living visionary), 
              her own <NumberBadge number={8} onClick={setSelectedNumber} /> and <NumberBadge number={6} onClick={setSelectedNumber} /> join your foundation.
            </p>
            <p>
              <strong className="text-gray-900">You</strong> shine as the Maher "Builder": double <NumberBadge number={8} onClick={setSelectedNumber} />, 
              soul <NumberBadge number={11} onClick={setSelectedNumber} />, birthday 25/<NumberBadge number={7} onClick={setSelectedNumber} />—living 
              the purpose, intuition and resilience of four generations.
            </p>
          </div>
        </div>

        {/* The Maher Legacy In You */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Maher Legacy In You</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={7} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">(wisdom/analysis)</span>
              </div>
              <p className="text-gray-700">Line from Grandpop ➡️ Dad ➡️ You.</p>
            </div>

            <div className="p-6 bg-purple-50 rounded-lg border-l-4 border-purple-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={8} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">(building/achievement)</span>
              </div>
              <p className="text-gray-700">The power everyone channels, now embodied as your path AND name.</p>
            </div>

            <div className="p-6 bg-amber-50 rounded-lg border-l-4 border-amber-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={11} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">(vision/inspiration)</span>
              </div>
              <p className="text-gray-700">Grandpop, Dad, Mom AND your Soul: a quadruple master channel.</p>
            </div>

            <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={33} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">(healing/teaching)</span>
              </div>
              <p className="text-gray-700">The "silent guide" from Grandma and Melanie, balancing your drive.</p>
            </div>
          </div>

          <div className="mt-6 p-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              <strong className="text-gray-900">Triplicity:</strong> Water/Earth (emotional depth + practical strength)
            </p>
          </div>
        </div>

        {/* What This Means */}
        <div className="mb-12 p-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl border-2 border-amber-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What This Means</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Christian, you are the next link in a chain of visionaries, builders, and healers.
            You inherit insight (<NumberBadge number={7} onClick={setSelectedNumber} />), the drive to achieve (<NumberBadge number={8} onClick={setSelectedNumber} />), 
            visionary gifts (<NumberBadge number={11} onClick={setSelectedNumber} />), and a well of empathy (<NumberBadge number={33} onClick={setSelectedNumber} />).
          </p>
          <p className="text-gray-900 font-bold text-xl mt-4">
            You are not only part of the Maher family—you are the living expression of its rarest hopes and strengths.
          </p>
        </div>

        {/* Closing Quote */}
        <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-gray-200">
          <blockquote className="text-xl italic text-gray-700 mb-4">
            "The numbers do not direct your fate—they remind you that you are never alone. 
            You carry all of us in you: a builder, a seeker, and a healer for the world."
          </blockquote>
          <div className="mt-6 pt-6 border-t-2 border-gray-300">
            <p className="text-lg font-semibold text-gray-900">The Maher Family</p>
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
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:mb-8 {
            margin-bottom: 2rem !important;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
}