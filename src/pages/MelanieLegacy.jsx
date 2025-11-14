import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Printer, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import NumberBadge from '../components/legacy/NumberBadge';
import FamilyTable from '../components/legacy/FamilyTable';
import { numerologyMeanings } from '../components/legacy/numerologyData';

export default function MelanieLegacy() {
  const [selectedNumber, setSelectedNumber] = useState(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 print:shadow-none">
        {/* Header */}
        <div className="text-center mb-12 print:mb-8">
          <Link to={createPageUrl('Home')} className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4 print:hidden">
            <ArrowLeft className="w-4 h-4" />
            Back to Family
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              The Maher Legacy
            </h1>
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-xl text-gray-600 italic">For Melanie Maher</p>
          <Button
            onClick={handlePrint}
            className="mt-6 print:hidden bg-purple-600 hover:bg-purple-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Document
          </Button>
        </div>

        {/* Introduction */}
        <div className="mb-12 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border-l-4 border-purple-600">
          <p className="text-gray-700 leading-relaxed">
            Click on any number below to learn its meaning in numerology and how it flows through the Maher family lineage.
          </p>
        </div>

        {/* Family Table */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Our Family's Master Number Map
          </h2>
          <FamilyTable onNumberClick={setSelectedNumber} highlightPerson="Melanie (Sister)" />
        </div>

        {/* Melanie's Unique Path */}
        <div className="mb-12 p-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl border-2 border-purple-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Unique Path</h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            Melanie, you are <strong>The Creative Healer</strong> of the Maher family—combining the leadership power of 
            <NumberBadge number={1} onClick={setSelectedNumber} /> with the creative expression of <NumberBadge number={3} onClick={setSelectedNumber} /> 
            and the master healing energy of <NumberBadge number={33} onClick={setSelectedNumber} />.
          </p>
          <p className="text-gray-900 font-bold text-xl">
            You bring joy, compassion, and creative healing light to balance the family's intense drive and power.
          </p>
        </div>

        {/* Melanie's Numbers Explained */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Numbers Explained</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-amber-50 rounded-lg border-l-4 border-amber-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={1} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">Life Path: The Leader</span>
              </div>
              <p className="text-gray-700">
                Your core path is one of independence, innovation, and leadership. You're meant to pioneer new directions 
                and lead with courage, never settling for the status quo.
              </p>
            </div>

            <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={3} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">Expression: The Creative Communicator</span>
              </div>
              <p className="text-gray-700">
                You express yourself through creativity, joy, and communication. You bring lightness and artistic vision 
                to everything you touch, making the world more beautiful.
              </p>
            </div>

            <div className="p-6 bg-purple-50 rounded-lg border-l-4 border-purple-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={33} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">Soul Urge: The Master Teacher</span>
              </div>
              <p className="text-gray-700">
                You share Grandma's rare master number 33—the ultimate healer and teacher. Your soul deeply desires 
                to nurture, heal, and uplift humanity with unconditional love.
              </p>
            </div>

            <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={6} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">Personality: The Nurturer</span>
              </div>
              <p className="text-gray-700">
                Others see you as caring, responsible, and harmonious. You naturally create beauty and balance 
                wherever you go, connecting you to Mom and Grandma's nurturing energy.
              </p>
            </div>
          </div>
        </div>

        {/* The Weave of Power */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Place in the Family Weave</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              You carry the rare <NumberBadge number={33} onClick={setSelectedNumber} /> Master Teacher energy—
              shared only with <strong>Grandma Elizabeth JoAnn</strong>. Together, you form the family's healing heart.
            </p>
            <p>
              Your <NumberBadge number={1} onClick={setSelectedNumber} /> Life Path connects you to <strong>Kyle</strong>—
              both of you pioneering leaders bringing fresh perspectives and independent strength.
            </p>
            <p>
              Your <NumberBadge number={3} onClick={setSelectedNumber} /> Expression is unique to you in the family, 
              bringing essential creativity, joy, and artistic communication to balance the intense power numbers.
            </p>
            <p>
              Your <NumberBadge number={6} onClick={setSelectedNumber} /> Personality links you to the family's nurturing 
              foundation, ensuring care and harmony flow through everything the family builds.
            </p>
            <p className="text-lg font-semibold text-purple-900 mt-6">
              Libra / Air-Earth: You blend intellectual balance with practical wisdom—thinking clearly while staying grounded.
            </p>
          </div>
        </div>

        {/* What This Means */}
        <div className="mb-12 p-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl border-2 border-purple-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What This Means</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Melanie, you are the family's <strong>creative healer and compassionate innovator</strong>. While others focus on 
            achievement and exploration, you ensure that success includes beauty, joy, and healing. Your combination of 
            leadership (<NumberBadge number={1} onClick={setSelectedNumber} />), creativity (<NumberBadge number={3} onClick={setSelectedNumber} />), 
            master healing (<NumberBadge number={33} onClick={setSelectedNumber} />), and nurturing care (<NumberBadge number={6} onClick={setSelectedNumber} />) 
            makes you the essential balance the family needs.
          </p>
          <p className="text-gray-900 font-bold text-xl mt-4">
            You remind the family that true power includes compassion, that achievement means nothing without love, 
            and that the greatest legacy is how we heal and uplift others.
          </p>
        </div>

        {/* Closing Quote */}
        <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-gray-200">
          <blockquote className="text-xl italic text-gray-700 mb-4">
            "The numbers do not direct your fate—they remind you that you are never alone. 
            You carry all of us in you: a healer, a creator, and a light for the world."
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
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold">
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
                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
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