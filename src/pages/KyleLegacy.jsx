import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Printer, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import NumberBadge from '../components/legacy/NumberBadge';
import FamilyTable from '../components/legacy/FamilyTable';
import { numerologyMeanings } from '../components/legacy/numerologyData';

export default function KyleLegacy() {
  const [selectedNumber, setSelectedNumber] = useState(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 print:shadow-none">
        {/* Header */}
        <div className="text-center mb-12 print:mb-8">
          <Link to={createPageUrl('Home')} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 print:hidden">
            <ArrowLeft className="w-4 h-4" />
            Back to Family
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              The Maher Legacy
            </h1>
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-xl text-gray-600 italic">For Kyle Maher</p>
          <Button
            onClick={handlePrint}
            className="mt-6 print:hidden bg-blue-600 hover:bg-blue-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Document
          </Button>
        </div>

        {/* Opening Message */}
        <div className="mb-12 p-8 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl border-2 border-blue-300">
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            Kyle,
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            You bring something essential to our family—the gift of freedom, adventure, and fearless exploration. While others build structures and seek wisdom, you remind us that life is meant to be lived fully, experienced deeply, and never confined.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg">
            Every number in your chart speaks to your unique role: the dynamic force that keeps our family moving, adapting, and embracing the unexpected.
          </p>
          <p className="text-gray-900 font-semibold text-lg mt-4">
            — Dad (Stephen)
          </p>
        </div>

        {/* Family Table */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Our Family's Master Number Map
          </h2>
          <FamilyTable onNumberClick={setSelectedNumber} highlightPerson="Kyle (Brother)" />
        </div>

        {/* Kyle's Unique Path */}
        <div className="mb-12 p-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl border-2 border-blue-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Unique Path</h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            Kyle, you are <strong>The Dynamic Adventurer</strong> of the Maher family—combining the freedom-seeking energy of 
            <NumberBadge number={5} onClick={setSelectedNumber} /> with the ambitious power of <NumberBadge number={8} onClick={setSelectedNumber} /> 
            and the pioneering independence of <NumberBadge number={1} onClick={setSelectedNumber} />.
          </p>
          <p className="text-gray-900 font-bold text-xl">
            You bring movement, change, and fearless exploration to the family's legacy of achievement.
          </p>
        </div>

        {/* Kyle's Numbers Explained */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Numbers Explained</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={5} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">Life Path: The Freedom Seeker</span>
              </div>
              <p className="text-gray-700">
                Your core path is one of freedom, adventure, and dynamic change. You thrive on variety and new experiences, 
                bringing adaptability and excitement wherever you go.
              </p>
            </div>

            <div className="p-6 bg-purple-50 rounded-lg border-l-4 border-purple-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={8} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">Expression: The Powerhouse</span>
              </div>
              <p className="text-gray-700">
                You share the family's powerful 8—the ability to manifest, achieve, and build. Combined with your 5 path, 
                you achieve success through unconventional means.
              </p>
            </div>

            <div className="p-6 bg-amber-50 rounded-lg border-l-4 border-amber-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={1} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">Soul Urge: The Leader</span>
              </div>
              <p className="text-gray-700">
                Your soul craves independence and the courage to forge your own path. You're driven to lead and innovate, 
                never content to simply follow.
              </p>
            </div>

            <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={7} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">Personality: The Seeker</span>
              </div>
              <p className="text-gray-700">
                You share the family wisdom path (7) through your outer personality. Others see you as thoughtful, 
                analytical, and spiritually aware—connecting you to Grandpop and Dad.
              </p>
            </div>
          </div>
        </div>

        {/* The Weave of Power */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Place in the Family Weave</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              You carry the <NumberBadge number={7} onClick={setSelectedNumber} /> wisdom line through your Personality—
              connecting you directly to <strong>Grandpop John Francis</strong> and <strong>Dad Stephen</strong>.
            </p>
            <p>
              Your <NumberBadge number={8} onClick={setSelectedNumber} /> Expression links you to the family's power to manifest—
              shared with Christian, Mom, and Grandma.
            </p>
            <p>
              Your unique <NumberBadge number={5} onClick={setSelectedNumber} /> Life Path brings something essential: 
              <strong>freedom, movement, and the courage to explore</strong>. You ensure the family doesn't become too rigid 
              in its achievements.
            </p>
            <p>
              Your <NumberBadge number={1} onClick={setSelectedNumber} /> Soul connects you to <strong>Melanie</strong>, 
              both of you pioneering new directions with independence and leadership.
            </p>
            <p className="text-lg font-semibold text-blue-900 mt-6">
              Cancer / Water-Fire: You blend emotional intuition with passionate action—feeling deeply while moving boldly.
            </p>
          </div>
        </div>

        {/* What This Means */}
        <div className="mb-12 p-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl border-2 border-blue-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What This Means</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Kyle, you are the family's <strong>adventurer and innovator</strong>. While others build structures and heal wounds, 
            you explore new territories and bring fresh perspectives. Your combination of freedom (<NumberBadge number={5} onClick={setSelectedNumber} />), 
            power (<NumberBadge number={8} onClick={setSelectedNumber} />), independence (<NumberBadge number={1} onClick={setSelectedNumber} />), 
            and wisdom (<NumberBadge number={7} onClick={setSelectedNumber} />) makes you uniquely equipped to take the family legacy 
            in unexpected, exciting directions.
          </p>
          <p className="text-gray-900 font-bold text-xl mt-4">
            You remind the family that success isn't just about building—it's also about the journey, the adventure, and the freedom to explore.
          </p>
        </div>

        {/* Closing Quote */}
        <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-gray-200">
          <blockquote className="text-xl italic text-gray-700 mb-4">
            "The numbers do not direct your fate—they remind you that you are never alone. 
            You carry all of us in you: an adventurer, a builder, and a wise seeker of truth."
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
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 text-white font-bold">
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
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
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