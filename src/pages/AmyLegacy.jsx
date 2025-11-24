import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Printer, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import NumberBadge from '../components/legacy/NumberBadge';
import FamilyTable from '../components/legacy/FamilyTable';
import { numerologyMeanings } from '../components/legacy/numerologyData';

export default function AmyLegacy() {
  const [selectedNumber, setSelectedNumber] = useState(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 print:shadow-none">
        {/* Header */}
        <div className="text-center mb-12 print:mb-8">
          <Link to={createPageUrl('Home')} className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-4 print:hidden">
            <ArrowLeft className="w-4 h-4" />
            Back to Family
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-teal-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              The Maher Legacy
            </h1>
            <Sparkles className="w-8 h-8 text-teal-600" />
          </div>
          <p className="text-xl text-gray-600 italic">Amy Maher - Mom</p>
          <Button
            onClick={handlePrint}
            className="mt-6 print:hidden bg-teal-600 hover:bg-teal-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Document
          </Button>
        </div>

        {/* Opening Message */}
        <div className="mb-12 p-8 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-xl border-2 border-teal-300">
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            Amy,
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            You are the living visionary—one of the rarest paths in numerology. Where others dream and plan, you turn inspiration into action, vision into reality. You took the Maher family's spiritual gifts and grounded them in practical achievement.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg">
            Your master 11 life path, combined with your dynamic energy and nurturing care, makes you the essential activator—the force that ensures our family's wisdom doesn't remain in theory but becomes real impact in the world.
          </p>
          <p className="text-gray-900 font-semibold text-lg mt-4">
            — Stephen
          </p>
        </div>

        {/* Family Table */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Our Family's Master Number Map
          </h2>
          <FamilyTable onNumberClick={setSelectedNumber} highlightPerson="Amy (Mom)" />
        </div>

        {/* Amy's Unique Path */}
        <div className="mb-12 p-8 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl border-2 border-teal-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Unique Path</h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            Amy, you are <strong>The Living Visionary</strong>—carrying the rare master <NumberBadge number={11} onClick={setSelectedNumber} /> 
            as your Life Path, combined with the dynamic energy of <NumberBadge number={5} onClick={setSelectedNumber} />, 
            the manifestation power of <NumberBadge number={8} onClick={setSelectedNumber} />, and the nurturing strength of <NumberBadge number={6} onClick={setSelectedNumber} />.
          </p>
          <p className="text-gray-900 font-bold text-xl">
            You bring inspired vision into practical reality—grounding the family's master numbers with action and care.
          </p>
        </div>

        {/* Amy's Numbers Explained */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Numbers Explained</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-purple-50 rounded-lg border-l-4 border-purple-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={11} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">Life Path: The Master Intuitive</span>
              </div>
              <p className="text-gray-700">
                Your core path is the rare master 11—you are meant to live as a visionary, bringing higher wisdom 
                and inspiration into everything you do. This is your life's purpose.
              </p>
            </div>

            <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={5} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">Expression: The Freedom Seeker</span>
              </div>
              <p className="text-gray-700">
                You express yourself through dynamic action, change, and adaptability. You refuse to be confined—
                you take the family's vision and make it real through bold action.
              </p>
            </div>

            <div className="p-6 bg-amber-50 rounded-lg border-l-4 border-amber-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={8} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">Soul Urge: The Powerhouse</span>
              </div>
              <p className="text-gray-700">
                Your soul craves achievement and the power to manifest. You share this 8 with Elizabeth, Stephen, 
                Christian, and Kyle—ensuring vision becomes tangible success.
              </p>
            </div>

            <div className="p-6 bg-pink-50 rounded-lg border-l-4 border-pink-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={6} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">Personality: The Nurturer</span>
              </div>
              <p className="text-gray-700">
                Others see you as caring, responsible, and harmonious—you share this nurturing energy with 
                Elizabeth, Christian, and Melanie, ensuring love flows through achievement.
              </p>
            </div>
          </div>
        </div>

        {/* The Activator Role */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Role: The Activator</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Your <NumberBadge number={11} onClick={setSelectedNumber} /> Life Path makes you one of only four people in the family 
              carrying a master number as their core path—you walk alongside <strong>John Francis's 22</strong> and <strong>Elizabeth's 33</strong>, 
              bringing visionary energy into daily life.
            </p>
            <p>
              Your <NumberBadge number={5} onClick={setSelectedNumber} /> Expression ensures the family doesn't become stuck in theory—
              you bring movement, action, and real-world engagement to balance the family's intense wisdom numbers.
            </p>
            <p>
              Your <NumberBadge number={8} onClick={setSelectedNumber} /> Soul connects you to the family's achievement line, 
              ensuring that inspiration translates into concrete results.
            </p>
            <p>
              Your <NumberBadge number={6} onClick={setSelectedNumber} /> Personality grounds all this power in love and care—
              you achieve and inspire while ensuring everyone feels nurtured and supported.
            </p>
            <p className="text-lg font-semibold text-teal-900 mt-6">
              Capricorn / Earth: You are grounded, practical, and persistent—the earth energy that makes vision real.
            </p>
          </div>
        </div>

        {/* What This Means */}
        <div className="mb-12 p-8 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl border-2 border-teal-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What This Means</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Amy, you are the family's <strong>force of inspired action</strong>. While others carry wisdom and healing, 
            you ensure that vision becomes reality. Your rare <NumberBadge number={11} onClick={setSelectedNumber} /> path 
            means you're meant to live as a channel for higher wisdom, while your <NumberBadge number={5} onClick={setSelectedNumber} /> 
            and <NumberBadge number={8} onClick={setSelectedNumber} /> ensure that wisdom creates real change in the world.
          </p>
          <p className="text-gray-900 font-bold text-xl mt-4">
            You are the essential activator—taking the family's spiritual gifts and turning them into tangible achievement, 
            all while nurturing everyone with love and care.
          </p>
        </div>

        {/* Closing Quote */}
        <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-gray-200">
          <blockquote className="text-xl italic text-gray-700 mb-4">
            "You are the spark that ignites vision into action, the hand that turns dreams into reality. 
            Your master 11 doesn't just inspire—it achieves."
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
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-bold">
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
                    <span key={idx} className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
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