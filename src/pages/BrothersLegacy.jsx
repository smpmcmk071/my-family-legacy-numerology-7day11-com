import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Printer, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import NumberBadge from '../components/legacy/NumberBadge';
import FamilyTable from '../components/legacy/FamilyTable';
import { numerologyMeanings } from '../components/legacy/numerologyData';

export default function BrothersLegacy() {
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
              The Three Brothers
            </h1>
            <Sparkles className="w-8 h-8 text-amber-600" />
          </div>
          <p className="text-xl text-gray-600 italic">David, Stephen & Kenneth Maher</p>
          <p className="text-lg text-gray-500 mt-2">Sons of John Francis & Elizabeth JoAnn</p>
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
          <FamilyTable onNumberClick={setSelectedNumber} highlightPerson="Stephen (Dad)" />
        </div>

        {/* The Three Brothers */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Three Brothers</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* David */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-300">
              <h3 className="text-2xl font-bold text-purple-900 mb-2">David</h3>
              <p className="text-sm text-purple-800 font-semibold mb-4">The Humanitarian Completer</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">Life Path:</span>
                  <NumberBadge number={9} onClick={setSelectedNumber} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">Expression:</span>
                  <NumberBadge number={3} onClick={setSelectedNumber} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">Soul Urge:</span>
                  <NumberBadge number={11} onClick={setSelectedNumber} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">Birthday:</span>
                  <span className="text-gray-600 text-sm">1</span>
                </div>
              </div>
            </div>

            {/* Stephen */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-300 ring-4 ring-amber-300">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">Stephen</h3>
              <p className="text-sm text-blue-800 font-semibold mb-4">The Bridge & Visionary</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">Life Path:</span>
                  <NumberBadge number={7} onClick={setSelectedNumber} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">Expression:</span>
                  <NumberBadge number={11} onClick={setSelectedNumber} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">Soul Urge:</span>
                  <NumberBadge number={8} onClick={setSelectedNumber} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">Birthday:</span>
                  <span className="text-gray-600 text-sm">7</span>
                </div>
              </div>
            </div>

            {/* Kenneth */}
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-300">
              <h3 className="text-2xl font-bold text-green-900 mb-2">Kenneth</h3>
              <p className="text-sm text-green-800 font-semibold mb-4">The Master Intuitive</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">Life Path:</span>
                  <NumberBadge number={11} onClick={setSelectedNumber} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">Expression:</span>
                  <NumberBadge number={5} onClick={setSelectedNumber} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">Soul Urge:</span>
                  <NumberBadge number={11} onClick={setSelectedNumber} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">Birthday:</span>
                  <span className="text-gray-600 text-sm">18/9</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connections to Parents */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Eternal Links to Mom & Dad</h2>
          
          <div className="space-y-6">
            {/* David to Parents */}
            <div className="p-6 bg-purple-50 rounded-lg border-l-4 border-purple-600">
              <h3 className="text-xl font-bold text-purple-900 mb-3">David's Connection</h3>
              <p className="text-gray-700 leading-relaxed">
                David's <NumberBadge number={9} onClick={setSelectedNumber} size="sm" /> life path echoes 
                Dad's <NumberBadge number={9} onClick={setSelectedNumber} size="sm" /> expression, creating a shared channel 
                for humanitarian wisdom and compassionate closure. His soul urge <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> 
                resonates with Dad's birth month 11 and soul urge <NumberBadge number={22} onClick={setSelectedNumber} size="sm" /> (master builder), 
                linking them in visionary intuition. His personality <NumberBadge number={2} onClick={setSelectedNumber} size="sm" /> 
                (from 33=6) ties to Mom's life path <NumberBadge number={6} onClick={setSelectedNumber} size="sm" />, adding nurturing harmony.
              </p>
            </div>

            {/* Stephen to Parents */}
            <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Stephen's Connection</h3>
              <p className="text-gray-700 leading-relaxed">
                Stephen inherits Dad's <NumberBadge number={7} onClick={setSelectedNumber} size="sm" /> life path—the seeker's wisdom 
                flowing directly down the line. His <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> expression carries 
                the master visionary gift from Dad's <NumberBadge number={22} onClick={setSelectedNumber} size="sm" /> soul urge and 
                birth month 11. The <NumberBadge number={8} onClick={setSelectedNumber} size="sm" /> soul urge connects to Mom's 
                birthday 26/<NumberBadge number={8} onClick={setSelectedNumber} size="sm" />, amplifying the family's achievement power. 
                His personality <NumberBadge number={9} onClick={setSelectedNumber} size="sm" /> mirrors Dad's expression for humanitarian 
                vision.
              </p>
            </div>

            {/* Kenneth to Parents */}
            <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-600">
              <h3 className="text-xl font-bold text-green-900 mb-3">Kenneth's Connection</h3>
              <p className="text-gray-700 leading-relaxed">
                Kenneth embodies the master <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> (both life path and soul urge), 
                echoing Dad's birth month 11 and soul urge <NumberBadge number={22} onClick={setSelectedNumber} size="sm" />—creating a 
                triple master channel for visionary mastery. His birthday <NumberBadge number={9} onClick={setSelectedNumber} size="sm" /> 
                and personality <NumberBadge number={9} onClick={setSelectedNumber} size="sm" /> echo Dad's <NumberBadge number={9} onClick={setSelectedNumber} size="sm" /> 
                expression for compassionate completion. The <NumberBadge number={5} onClick={setSelectedNumber} size="sm" /> expression 
                ties to Dad's personality 5, bringing freedom and adaptability.
              </p>
            </div>
          </div>
        </div>

        {/* Connections to Grandparents */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Links to Great-Grandparents</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Thomas Francis Connections */}
            <div className="p-6 bg-green-50 rounded-lg border-2 border-green-300">
              <h3 className="text-lg font-bold text-green-900 mb-3">
                From Thomas Francis Maher
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  • His <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> expression flows to 
                  Stephen's <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> and 
                  Kenneth's double <NumberBadge number={11} onClick={setSelectedNumber} size="sm" />
                </p>
                <p>
                  • His <NumberBadge number={3} onClick={setSelectedNumber} size="sm" /> life path connects to 
                  David's <NumberBadge number={3} onClick={setSelectedNumber} size="sm" /> expression—creative communication
                </p>
                <p>
                  • His <NumberBadge number={5} onClick={setSelectedNumber} size="sm" /> soul urge ties to 
                  Kenneth's <NumberBadge number={5} onClick={setSelectedNumber} size="sm" /> expression—freedom and adventure
                </p>
              </div>
            </div>

            {/* Mary Agnes Connections */}
            <div className="p-6 bg-rose-50 rounded-lg border-2 border-rose-300">
              <h3 className="text-lg font-bold text-rose-900 mb-3">
                From Mary Agnes O'Neill Maher
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  • Her <NumberBadge number={9} onClick={setSelectedNumber} size="sm" /> life path flows to 
                  David's <NumberBadge number={9} onClick={setSelectedNumber} size="sm" /> and 
                  Kenneth's <NumberBadge number={9} onClick={setSelectedNumber} size="sm" /> birthday/personality
                </p>
                <p>
                  • Her <NumberBadge number={7} onClick={setSelectedNumber} size="sm" /> soul urge mirrors 
                  Stephen's <NumberBadge number={7} onClick={setSelectedNumber} size="sm" /> life path—wisdom seeking
                </p>
                <p>
                  • Her <NumberBadge number={8} onClick={setSelectedNumber} size="sm" /> expression connects to 
                  Stephen's <NumberBadge number={8} onClick={setSelectedNumber} size="sm" /> soul urge—achievement power
                </p>
                <p>
                  • Her <NumberBadge number={1} onClick={setSelectedNumber} size="sm" /> personality flows to 
                  David's birthday <NumberBadge number={1} onClick={setSelectedNumber} size="sm" />—independent leadership
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The Brotherly Bond */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Brotherly Bond</h2>
          
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">David & Stephen</h3>
              <p className="text-gray-700">
                Connected through the <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> master channel 
                (David's soul, Stephen's expression) and the <NumberBadge number={9} onClick={setSelectedNumber} size="sm" /> 
                humanitarian thread (David's life path, Stephen's personality).
              </p>
            </div>

            <div className="p-6 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Stephen & Kenneth</h3>
              <p className="text-gray-700">
                United by the <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> master visionary energy 
                (both carry 11) and the <NumberBadge number={7} onClick={setSelectedNumber} size="sm" /> wisdom path 
                (Stephen's life path and maturity, Kenneth's challenge).
              </p>
            </div>

            <div className="p-6 bg-gradient-to-r from-purple-100 to-green-100 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">David & Kenneth</h3>
              <p className="text-gray-700">
                Bound by the double <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> soul urge (both intuitive visionaries) 
                and the <NumberBadge number={9} onClick={setSelectedNumber} size="sm" /> completion energy 
                (David's life path, Kenneth's birthday/personality).
              </p>
            </div>

            <div className="p-6 bg-amber-50 rounded-lg border-2 border-amber-300 mt-6">
              <p className="text-gray-700 font-semibold">
                <strong className="text-amber-900">Triple Unity:</strong> All three brothers share the master <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> 
                energy (David and Kenneth in soul, Stephen in expression), creating a fraternal trinity of visionaries. 
                The <NumberBadge number={9} onClick={setSelectedNumber} size="sm" /> flows through all three, ensuring 
                wisdom and completion guide their paths together.
              </p>
            </div>
          </div>
        </div>

        {/* What This Means */}
        <div className="mb-12 p-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl border-2 border-amber-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What This Brotherhood Means</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
            <p>
              You are not just brothers—you are a trinity of purpose. David brings humanitarian completion (<NumberBadge number={9} onClick={setSelectedNumber} size="sm" />) 
              and creative joy (<NumberBadge number={3} onClick={setSelectedNumber} size="sm" />). Stephen bridges wisdom 
              (<NumberBadge number={7} onClick={setSelectedNumber} size="sm" />) with achievement power (<NumberBadge number={8} onClick={setSelectedNumber} size="sm" />). 
              Kenneth embodies pure visionary mastery (double <NumberBadge number={11} onClick={setSelectedNumber} size="sm" />).
            </p>
            <p>
              Together, you carry forward the legacy of Thomas Francis, Mary Agnes, John Francis, and Elizabeth JoAnn—
              a four-generation weave of wisdom, building, healing, and vision.
            </p>
            <p className="text-gray-900 font-bold text-xl">
              Your bond transcends blood. It is written in numbers, sealed in masters, and destined to shape the world.
            </p>
          </div>
        </div>

        {/* Closing Quote */}
        <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-gray-200">
          <blockquote className="text-xl italic text-gray-700 mb-4">
            "Three brothers, one lineage. Three paths, one purpose. Three hearts, one eternal bond."
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