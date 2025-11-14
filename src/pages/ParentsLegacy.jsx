import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Printer, Sparkles, ArrowLeft, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import NumberBadge from '../components/legacy/NumberBadge';
import FamilyTable from '../components/legacy/FamilyTable';
import { numerologyMeanings } from '../components/legacy/numerologyData';

export default function ParentsLegacy() {
  const [selectedNumber, setSelectedNumber] = useState(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 print:shadow-none">
        {/* Header */}
        <div className="text-center mb-12 print:mb-8">
          <Link to={createPageUrl('Home')} className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 mb-4 print:hidden">
            <ArrowLeft className="w-4 h-4" />
            Back to Family
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-rose-600 fill-rose-200" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              The Maher Legacy
            </h1>
            <Heart className="w-8 h-8 text-rose-600 fill-rose-200" />
          </div>
          <p className="text-xl text-gray-600 italic">For Christian, Kyle, and Melanie</p>
          <p className="text-lg text-gray-500 mt-2">From Mom & Dad</p>
          <Button
            onClick={handlePrint}
            className="mt-6 print:hidden bg-rose-600 hover:bg-rose-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Document
          </Button>
        </div>

        {/* Introduction */}
        <div className="mb-12 p-6 bg-gradient-to-r from-rose-100 to-pink-100 rounded-lg border-l-4 border-rose-600">
          <p className="text-gray-700 leading-relaxed">
            This document is for you, our children. We want you to understand the numerological legacy you carry—
            not as a burden, but as a gift passed down through generations of your family.
          </p>
        </div>

        {/* Family Table */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Our Family's Master Number Map
          </h2>
          <FamilyTable onNumberClick={setSelectedNumber} />
        </div>

        {/* Our Partnership */}
        <div className="mb-12 p-8 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl border-2 border-rose-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-600" />
            Mom & Dad: The Partnership
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-lg">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Dad (Stephen)</h3>
              <div className="space-y-2 text-gray-700">
                <p><NumberBadge number={7} onClick={setSelectedNumber} size="sm" /> <strong>Life Path:</strong> The wisdom seeker</p>
                <p><NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> <strong>Expression:</strong> Master intuitive</p>
                <p><NumberBadge number={8} onClick={setSelectedNumber} size="sm" /> <strong>Soul:</strong> Achievement & power</p>
                <p><NumberBadge number={9} onClick={setSelectedNumber} size="sm" /> <strong>Personality:</strong> Humanitarian wisdom</p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg">
              <h3 className="text-xl font-bold text-teal-900 mb-3">Mom (Amy)</h3>
              <div className="space-y-2 text-gray-700">
                <p><NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> <strong>Life Path:</strong> Living visionary</p>
                <p><NumberBadge number={5} onClick={setSelectedNumber} size="sm" /> <strong>Expression:</strong> Dynamic action</p>
                <p><NumberBadge number={8} onClick={setSelectedNumber} size="sm" /> <strong>Soul:</strong> Achievement & power</p>
                <p><NumberBadge number={6} onClick={setSelectedNumber} size="sm" /> <strong>Personality:</strong> Nurturing care</p>
              </div>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg mt-6">
            Together, we combine deep wisdom (<NumberBadge number={7} onClick={setSelectedNumber} />) with inspired vision (<NumberBadge number={11} onClick={setSelectedNumber} />), 
            powerful manifestation (<NumberBadge number={8} onClick={setSelectedNumber} />), dynamic action (<NumberBadge number={5} onClick={setSelectedNumber} />), 
            loving care (<NumberBadge number={6} onClick={setSelectedNumber} />), and humanitarian purpose (<NumberBadge number={9} onClick={setSelectedNumber} />).
          </p>
        </div>

        {/* What We've Given You */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What We've Given Each of You</h2>
          <div className="space-y-6">
            <div className="p-6 bg-amber-50 rounded-lg border-l-4 border-amber-600">
              <h3 className="text-xl font-bold text-amber-900 mb-3">Christian</h3>
              <p className="text-gray-700 leading-relaxed">
                You received the most concentrated power: double <NumberBadge number={8} onClick={setSelectedNumber} /> from both of us, 
                soul <NumberBadge number={11} onClick={setSelectedNumber} /> from Mom's life path and Dad's expression, 
                and the <NumberBadge number={7} onClick={setSelectedNumber} /> wisdom line from Dad and Grandpop. 
                You are the living embodiment of the family's highest potential—builder, visionary, and healer.
              </p>
            </div>

            <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Kyle</h3>
              <p className="text-gray-700 leading-relaxed">
                You received Mom's dynamic <NumberBadge number={5} onClick={setSelectedNumber} /> energy and our shared <NumberBadge number={8} onClick={setSelectedNumber} /> achievement drive, 
                plus Dad's <NumberBadge number={7} onClick={setSelectedNumber} /> wisdom in your personality. 
                You bring the essential gift of freedom and adventure—reminding the family that life is meant to be explored, not just achieved.
              </p>
            </div>

            <div className="p-6 bg-purple-50 rounded-lg border-l-4 border-purple-600">
              <h3 className="text-xl font-bold text-purple-900 mb-3">Melanie</h3>
              <p className="text-gray-700 leading-relaxed">
                You received Grandma's rare <NumberBadge number={33} onClick={setSelectedNumber} /> master teacher energy and Mom's <NumberBadge number={6} onClick={setSelectedNumber} /> nurturing personality, 
                combined with creative <NumberBadge number={3} onClick={setSelectedNumber} /> expression and pioneering <NumberBadge number={1} onClick={setSelectedNumber} /> leadership. 
                You bring the essential balance of healing, creativity, and compassion to temper the family's intense drive.
              </p>
            </div>
          </div>
        </div>

        {/* Our Hope For You */}
        <div className="mb-12 p-8 bg-gradient-to-br from-rose-100 to-purple-100 rounded-xl border-2 border-rose-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Hope For You</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
            <p>
              We didn't choose these numbers for you—they emerged naturally from our union and from the generations before us. 
              But we hope you'll see them as a reminder of the gifts you carry.
            </p>
            <p>
              <strong>Christian</strong>, use your power to build something meaningful. Your double 8 isn't about wealth—it's about creating lasting impact.
            </p>
            <p>
              <strong>Kyle</strong>, embrace your freedom. Your 5 reminds us all that success means nothing without the courage to explore and live fully.
            </p>
            <p>
              <strong>Melanie</strong>, never underestimate your healing gift. Your 33 and 3 bring the joy and compassion that make all achievement worthwhile.
            </p>
            <p className="text-gray-900 font-bold text-xl mt-6">
              Together, you three carry everything: wisdom, power, vision, freedom, creativity, and healing. 
              You are each unique, yet you complete each other—and you complete us.
            </p>
          </div>
        </div>

        {/* Closing Message */}
        <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-gray-200">
          <blockquote className="text-xl italic text-gray-700 mb-4">
            "These numbers don't define you—they simply reflect the gifts we've seen in you from the beginning. 
            Use them, honor them, or ignore them entirely. What matters most is that you know: 
            you carry the love, wisdom, and strength of everyone who came before you."
          </blockquote>
          <div className="mt-6 pt-6 border-t-2 border-gray-300">
            <p className="text-lg font-semibold text-gray-900">With all our love,</p>
            <p className="text-xl font-bold text-gray-900 mt-2">Mom & Dad</p>
            <p className="text-gray-600">November 2025</p>
          </div>
        </div>
      </div>

      {/* Number Explanation Modal */}
      <Dialog open={!!selectedNumber} onOpenChange={() => setSelectedNumber(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white font-bold">
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
                    <span key={idx} className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-sm font-medium">
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