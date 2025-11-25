import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Printer, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import NumberBadge from '../components/legacy/NumberBadge';
import FamilyTable from '../components/legacy/FamilyTable';
import DailySongs from '../components/legacy/DailySongs';
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
          <Link to={createPageUrl('Home')} className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-4 print:hidden">
            <ArrowLeft className="w-4 h-4" />
            Back to Family
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-amber-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              The Maher Legacy
            </h1>
            <Sparkles className="w-8 h-8 text-amber-600" />
          </div>
          <p className="text-xl text-gray-600 italic">Four Generations of Vision, Power & Love</p>
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
          <p className="text-gray-700 leading-relaxed text-lg">
            From Thomas Francis and Mary Agnes through John Francis and Elizabeth JoAnn, to Stephen and Amy, down to Christian, Kyle, and Melanie—
            this is the story of a family woven together by master numbers, wisdom, achievement, and unconditional love.
            <span className="print:hidden"> Click any number to explore its deeper meaning.</span>
          </p>
        </div>

        {/* Family Table */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Our Family's Master Number Map
          </h2>
          <FamilyTable onNumberClick={setSelectedNumber} />
        </div>

        {/* Daily Songs */}
        <div className="mb-12 print:hidden">
          <DailySongs />
        </div>

        {/* The Weave of Power Through Generations */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Weave of Power Through Generations</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong className="text-gray-900">Thomas Francis & Mary Agnes</strong> (Great-Grandparents): The foundation with 
              <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> master vision, <NumberBadge number={9} onClick={setSelectedNumber} size="sm" /> humanitarian wisdom, 
              and <NumberBadge number={8} onClick={setSelectedNumber} size="sm" /> achievement power—establishing the family's spiritual architecture.
            </p>
            <p>
              <strong className="text-gray-900">John Francis & Elizabeth JoAnn</strong> (Grandparents): The builders with 
              <NumberBadge number={22} onClick={setSelectedNumber} size="sm" /> master building, <NumberBadge number={33} onClick={setSelectedNumber} size="sm" /> master healing, 
              and <NumberBadge number={7} onClick={setSelectedNumber} size="sm" /> wisdom—creating an unshakeable foundation of love and insight.
            </p>
            <p>
              <strong className="text-gray-900">Stephen, David & Kenneth</strong> (The Brothers): The bridge generation carrying 
              <NumberBadge number={7} onClick={setSelectedNumber} size="sm" /> wisdom, triple <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> vision, 
              <NumberBadge number={9} onClick={setSelectedNumber} size="sm" /> completion, and <NumberBadge number={8} onClick={setSelectedNumber} size="sm" /> achievement forward.
            </p>
            <p>
              <strong className="text-gray-900">Stephen & Amy</strong> (Parents): Rare double <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> visionaries 
              with <NumberBadge number={8} onClick={setSelectedNumber} size="sm" /> power and <NumberBadge number={6} onClick={setSelectedNumber} size="sm" /> nurturing—
              guiding the next generation with love and purpose.
            </p>
            <p>
              <strong className="text-gray-900">Christian, Kyle & Melanie</strong> (The Children): The inheritors—carrying double <NumberBadge number={8} onClick={setSelectedNumber} size="sm" />, 
              master <NumberBadge number={11} onClick={setSelectedNumber} size="sm" />, <NumberBadge number={33} onClick={setSelectedNumber} size="sm" /> healing, 
              and the complete legacy of four generations into the future.
            </p>
          </div>
        </div>

        {/* Key Family Numbers */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Family's Core Numbers</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={7} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">The Wisdom Thread</span>
              </div>
              <p className="text-gray-700">Mary Agnes ➡️ John Francis ➡️ Stephen ➡️ Christian. The seekers who look beyond the surface.</p>
            </div>

            <div className="p-6 bg-purple-50 rounded-lg border-l-4 border-purple-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={8} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">The Achievement Power</span>
              </div>
              <p className="text-gray-700">Mary Agnes ➡️ Elizabeth ➡️ Stephen/Amy ➡️ Christian/Kyle. The builders who manifest dreams.</p>
            </div>

            <div className="p-6 bg-amber-50 rounded-lg border-l-4 border-amber-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={11} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">The Master Visionary Channel</span>
              </div>
              <p className="text-gray-700">Thomas ➡️ John Francis ➡️ Stephen/Amy/Kenneth/David ➡️ Christian. The illuminators.</p>
            </div>

            <div className="p-6 bg-pink-50 rounded-lg border-l-4 border-pink-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={6} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">The Nurturing Foundation</span>
              </div>
              <p className="text-gray-700">Thomas (personality) ➡️ Elizabeth JoAnn ➡️ Amy ➡️ Christian/Melanie. The caregivers and harmonizers.</p>
            </div>

            <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={33} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">The Master Healer</span>
              </div>
              <p className="text-gray-700">Elizabeth JoAnn ➡️ Melanie. The silent guides who teach through compassion.</p>
            </div>

            <div className="p-6 bg-orange-50 rounded-lg border-l-4 border-orange-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={9} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">The Humanitarian Line</span>
              </div>
              <p className="text-gray-700">Mary Agnes ➡️ John Francis ➡️ David/Kenneth ➡️ Amy. Completing cycles with wisdom and love.</p>
            </div>
          </div>
        </div>

        {/* What This Means */}
        <div className="mb-12 p-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl border-2 border-amber-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What This Family Legacy Means</h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            The Maher family is not built by chance—it is architected by destiny. Four generations of 
            <NumberBadge number={7} onClick={setSelectedNumber} size="sm" /> wisdom, 
            <NumberBadge number={8} onClick={setSelectedNumber} size="sm" /> achievement, 
            <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> vision, 
            <NumberBadge number={22} onClick={setSelectedNumber} size="sm" /> building, and 
            <NumberBadge number={33} onClick={setSelectedNumber} size="sm" /> healing converge to create a legacy of purpose.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            The <NumberBadge number={6} onClick={setSelectedNumber} size="sm" /> nurturing thread—woven through Thomas's personality, 
            Elizabeth JoAnn's life path, Amy's personality, and into Christian and Melanie—ensures this power is always balanced with love, 
            responsibility, and care for others.
          </p>
          <p className="text-gray-900 font-bold text-xl">
            This is more than a family tree—it is a constellation of purpose, where every number proves that the Mahers 
            were meant to build, heal, teach, and illuminate the world.
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