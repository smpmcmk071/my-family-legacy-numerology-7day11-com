import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Printer, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import NumberBadge from '../components/legacy/NumberBadge';
import FamilyTable from '../components/legacy/FamilyTable';
import { numerologyMeanings } from '../components/legacy/numerologyData';

export default function StephenLegacy() {
  const [selectedNumber, setSelectedNumber] = useState(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 md:p-12">
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
          <p className="text-xl text-gray-600 italic">Stephen Maher - Dad</p>
          <Button
            onClick={handlePrint}
            className="mt-6 print:hidden bg-blue-600 hover:bg-blue-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Document
          </Button>
        </div>

        {/* Introduction */}
        <div className="mb-12 p-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg border-l-4 border-blue-600">
          <p className="text-gray-700 leading-relaxed">
            Click on any number below to learn its meaning in numerology and how it flows through the Maher family lineage.
          </p>
        </div>

        {/* Family Table */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Our Family's Master Number Map
          </h2>
          <FamilyTable onNumberClick={setSelectedNumber} highlightPerson="Stephen (Dad)" />
        </div>

        {/* Stephen's Unique Path */}
        <div className="mb-12 p-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl border-2 border-blue-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Unique Path</h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            Stephen, you are <strong>The Bridge Between Worlds</strong>—combining the wisdom-seeking path of 
            <NumberBadge number={7} onClick={setSelectedNumber} /> with the visionary power of <NumberBadge number={11} onClick={setSelectedNumber} />, 
            the manifestation strength of <NumberBadge number={8} onClick={setSelectedNumber} />, and the humanitarian wisdom of <NumberBadge number={9} onClick={setSelectedNumber} />.
          </p>
          <p className="text-gray-900 font-bold text-xl">
            You are the vital link connecting Grandpop's master builder vision to your children's future.
          </p>
        </div>

        {/* Stephen's Numbers Explained */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Numbers Explained</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={7} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">Life Path: The Seeker of Truth</span>
              </div>
              <p className="text-gray-700">
                You inherited your father's wisdom path—the drive to understand life's deeper mysteries, to analyze, 
                and to seek truth beneath the surface. You pass this directly to Christian.
              </p>
            </div>

            <div className="p-6 bg-purple-50 rounded-lg border-l-4 border-purple-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={11} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">Expression: The Master Intuitive</span>
              </div>
              <p className="text-gray-700">
                Like your father and your wife, you carry the master 11—intuition, vision, and the ability to 
                see beyond the ordinary. This master number flows through all your children.
              </p>
            </div>

            <div className="p-6 bg-amber-50 rounded-lg border-l-4 border-amber-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={8} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">Soul Urge: The Powerhouse</span>
              </div>
              <p className="text-gray-700">
                Your soul craves achievement and the power to manifest. This 8 energy connects you to your mother, 
                your wife, and Christian—ensuring the family can turn vision into reality.
              </p>
            </div>

            <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={9} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">Personality: The Humanitarian</span>
              </div>
              <p className="text-gray-700">
                You share your father's humanitarian 9 in your outer personality—others see you as wise, 
                compassionate, and driven by purpose beyond personal gain.
              </p>
            </div>
          </div>
        </div>

        {/* The Connector Role */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Role: The Connector</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              You carry the <NumberBadge number={7} onClick={setSelectedNumber} /> wisdom line from <strong>Grandpop John Francis</strong> 
              and pass it directly to <strong>Christian</strong>—a three-generation chain of truth-seekers.
            </p>
            <p>
              Your <NumberBadge number={11} onClick={setSelectedNumber} /> Expression connects you to your father's master builder vision, 
              your wife's living visionary path, and Christian's soul purpose—creating a powerful intuitive channel through the family.
            </p>
            <p>
              Your <NumberBadge number={8} onClick={setSelectedNumber} /> Soul links you to the family's manifestation power, 
              ensuring that wisdom and vision translate into real-world achievement.
            </p>
            <p>
              Your <NumberBadge number={9} onClick={setSelectedNumber} /> Personality ensures that all this power serves a higher purpose—
              the humanitarian wisdom that your father embodied flows through you to guide the next generation.
            </p>
            <p className="text-lg font-semibold text-blue-900 mt-6">
              Scorpio / Water-Air: You blend emotional depth with intellectual clarity—feeling deeply while thinking clearly.
            </p>
          </div>
        </div>

        {/* What This Means */}
        <div className="mb-12 p-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl border-2 border-blue-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What This Means</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Stephen, you are the family's <strong>essential bridge</strong>. You took what your parents gave you—
            your father's wisdom (<NumberBadge number={7} onClick={setSelectedNumber} />, <NumberBadge number={11} onClick={setSelectedNumber} />, 
            <NumberBadge number={22} onClick={setSelectedNumber} />) and your mother's healing strength (<NumberBadge number={33} onClick={setSelectedNumber} />, 
            <NumberBadge number={8} onClick={setSelectedNumber} />)—and combined it with Amy's visionary power to create the next generation.
          </p>
          <p className="text-gray-900 font-bold text-xl mt-4">
            Without you, the master numbers of your father and the healing power of your mother would never have reached your children. 
            You are the vital link that keeps the legacy alive.
          </p>
        </div>

        {/* Closing Quote */}
        <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-gray-200">
          <blockquote className="text-xl italic text-gray-700 mb-4">
            "You are the bridge between generations—carrying forward your father's vision while creating the foundation 
            for your children's future. The wisdom flows through you."
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
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
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