import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Printer, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import NumberBadge from '../components/legacy/NumberBadge';
import FamilyTable from '../components/legacy/FamilyTable';
import { numerologyMeanings } from '../components/legacy/numerologyData';

export default function GrandparentsLegacy() {
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
              The Grandparents Legacy
            </h1>
            <Sparkles className="w-8 h-8 text-amber-600" />
          </div>
          <p className="text-xl text-gray-600 italic">John Francis & Elizabeth JoAnn</p>
          <p className="text-lg text-gray-500 mt-2">The Foundation of the Maher Vision</p>
          <Button
            onClick={handlePrint}
            className="mt-6 print:hidden bg-amber-600 hover:bg-amber-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Document
          </Button>
        </div>

        {/* Opening Message */}
        <div className="mb-12 p-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl border-2 border-amber-300">
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            To our children and grandchildren,
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            We built this foundation with master numbers—wisdom, building power, and healing love—not knowing how it would flow through the generations. But seeing Stephen carry it forward, and watching Christian, Kyle, and Melanie embody its highest expression, we understand now what we were creating.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg">
            These numbers tell the story of a family architected by destiny, where every generation builds upon the last to create something greater than any individual could achieve alone.
          </p>
          <p className="text-gray-900 font-semibold text-lg mt-4">
            — Grandpop John Francis & Grandma Elizabeth JoAnn
          </p>
        </div>

        {/* Family Table */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Our Family's Master Number Map
          </h2>
          <FamilyTable onNumberClick={setSelectedNumber} highlightPerson="John Francis (Grandpop)" />
        </div>

        {/* The Foundation Builders */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Foundation Builders</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* John Francis */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-300">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">John Francis Maher</h3>
              <p className="text-lg text-blue-800 font-semibold mb-4">The Master Builder & Visionary</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Life Path:</span>
                  <div className="flex items-center gap-2">
                    <NumberBadge number={7} onClick={setSelectedNumber} />
                    <span className="text-sm text-gray-600">The Seeker</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Expression:</span>
                  <div className="flex items-center gap-2">
                    <NumberBadge number={9} onClick={setSelectedNumber} />
                    <span className="text-sm text-gray-600">The Humanitarian</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Soul Urge:</span>
                  <div className="flex items-center gap-2">
                    <NumberBadge number={22} onClick={setSelectedNumber} />
                    <span className="text-sm text-gray-600">Master Builder</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Birthday:</span>
                  <span className="text-gray-600">22 (Master)</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-sm text-gray-700 italic">
                  The visionary who laid the foundation with wisdom (<NumberBadge number={7} onClick={setSelectedNumber} size="sm" />), 
                  master building power (<NumberBadge number={22} onClick={setSelectedNumber} size="sm" />), 
                  and humanitarian service (<NumberBadge number={9} onClick={setSelectedNumber} size="sm" />).
                </p>
              </div>
            </div>

            {/* Elizabeth JoAnn */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-300">
              <h3 className="text-2xl font-bold text-purple-900 mb-4">Elizabeth JoAnn Maher</h3>
              <p className="text-lg text-purple-800 font-semibold mb-4">The Master Healer & Anchor</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Life Path:</span>
                  <div className="flex items-center gap-2">
                    <NumberBadge number={6} onClick={setSelectedNumber} />
                    <span className="text-sm text-gray-600">The Nurturer</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Expression:</span>
                  <div className="flex items-center gap-2">
                    <NumberBadge number={7} onClick={setSelectedNumber} />
                    <span className="text-sm text-gray-600">The Seeker</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Soul Urge:</span>
                  <div className="flex items-center gap-2">
                    <NumberBadge number={33} onClick={setSelectedNumber} />
                    <span className="text-sm text-gray-600">Master Teacher</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Birthday:</span>
                  <span className="text-gray-600">26/8</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-purple-200">
                <p className="text-sm text-gray-700 italic">
                  The anchor with unconditional love (<NumberBadge number={33} onClick={setSelectedNumber} size="sm" />), 
                  intuitive wisdom (<NumberBadge number={7} onClick={setSelectedNumber} size="sm" />), 
                  and nurturing care (<NumberBadge number={6} onClick={setSelectedNumber} size="sm" />).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Great-Grandparents Foundation */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Great-Grandparents' Foundation</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Paternal Line */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Paternal Great-Grandparents</h3>
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-300">
                <h4 className="text-xl font-bold text-green-900 mb-3">Thomas Francis Maher</h4>
                <p className="text-sm text-green-800 font-semibold mb-3">The Creative Visionary</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Life Path:</span>
                    <NumberBadge number={3} onClick={setSelectedNumber} size="sm" />
                  </div>
                  <div className="flex justify-between">
                    <span>Expression:</span>
                    <NumberBadge number={11} onClick={setSelectedNumber} size="sm" />
                  </div>
                  <div className="flex justify-between">
                    <span>Soul Urge:</span>
                    <NumberBadge number={5} onClick={setSelectedNumber} size="sm" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl border-2 border-rose-300">
                <h4 className="text-xl font-bold text-rose-900 mb-3">Mary Agnes O'Neill Maher</h4>
                <p className="text-sm text-rose-800 font-semibold mb-3">The Compassionate Anchor</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Life Path:</span>
                    <NumberBadge number={9} onClick={setSelectedNumber} size="sm" />
                  </div>
                  <div className="flex justify-between">
                    <span>Expression:</span>
                    <NumberBadge number={8} onClick={setSelectedNumber} size="sm" />
                  </div>
                  <div className="flex justify-between">
                    <span>Soul Urge:</span>
                    <NumberBadge number={7} onClick={setSelectedNumber} size="sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Maternal Line */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Maternal Great-Grandparents</h3>
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-300">
                <h4 className="text-xl font-bold text-blue-900 mb-3">George Shotts Wilson</h4>
                <p className="text-sm text-blue-800 font-semibold mb-3">The Independent Leader</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Life Path:</span>
                    <NumberBadge number={1} onClick={setSelectedNumber} size="sm" />
                  </div>
                  <div className="flex justify-between">
                    <span>Expression:</span>
                    <NumberBadge number={7} onClick={setSelectedNumber} size="sm" />
                  </div>
                  <div className="flex justify-between">
                    <span>Soul Urge:</span>
                    <NumberBadge number={6} onClick={setSelectedNumber} size="sm" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border-2 border-indigo-300">
                <h4 className="text-xl font-bold text-indigo-900 mb-3">Elizabeth Elanor Wilson</h4>
                <p className="text-sm text-indigo-800 font-semibold mb-3">The Nurturing Seeker</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Life Path:</span>
                    <NumberBadge number={2} onClick={setSelectedNumber} size="sm" />
                  </div>
                  <div className="flex justify-between">
                    <span>Expression:</span>
                    <NumberBadge number={6} onClick={setSelectedNumber} size="sm" />
                  </div>
                  <div className="flex justify-between">
                    <span>Soul Urge:</span>
                    <NumberBadge number={33} onClick={setSelectedNumber} size="sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-amber-50 rounded-lg border-l-4 border-amber-500">
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-amber-900">Paternal Legacy:</strong> Thomas Francis's <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> 
                expression flows to Stephen's <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> and Kenneth's double <NumberBadge number={11} onClick={setSelectedNumber} size="sm" />. 
                Mary Agnes's <NumberBadge number={9} onClick={setSelectedNumber} size="sm" /> life path flows to David and Kenneth, 
                while her <NumberBadge number={7} onClick={setSelectedNumber} size="sm" /> soul urge mirrors John Francis and Stephen's wisdom path.
              </p>
            </div>

            <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-blue-900">Maternal Legacy:</strong> George Shotts Wilson's <NumberBadge number={1} onClick={setSelectedNumber} size="sm" /> 
                leadership and <NumberBadge number={7} onClick={setSelectedNumber} size="sm" /> wisdom adds to the family's analytical power. 
                Elizabeth Elanor Wilson's <NumberBadge number={33} onClick={setSelectedNumber} size="sm" /> master teacher/healer energy creates a dual 
                <NumberBadge number={33} onClick={setSelectedNumber} size="sm" /> channel (with Elizabeth JoAnn) flowing to Melanie—
                a powerful maternal healing line through the generations.
              </p>
            </div>
          </div>
        </div>

        {/* The Bridge: Stephen */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Bridge: Stephen, David & Kenneth</h2>
          
          <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-300">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Stephen Maher - The Connector</h3>
            <p className="text-lg text-slate-700 mb-6">
              Carrying forward the wisdom of John Francis and the healing love of Elizabeth JoAnn
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs font-semibold text-blue-900 mb-2">Stephen</p>
                <div className="space-y-1">
                  <div className="flex gap-1">
                    <span className="text-xs text-gray-600">LP:</span>
                    <NumberBadge number={7} onClick={setSelectedNumber} size="sm" />
                  </div>
                  <div className="flex gap-1">
                    <span className="text-xs text-gray-600">Exp:</span>
                    <NumberBadge number={11} onClick={setSelectedNumber} size="sm" />
                  </div>
                  <div className="flex gap-1">
                    <span className="text-xs text-gray-600">Soul:</span>
                    <NumberBadge number={8} onClick={setSelectedNumber} size="sm" />
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs font-semibold text-purple-900 mb-2">David</p>
                <div className="space-y-1">
                  <div className="flex gap-1">
                    <span className="text-xs text-gray-600">LP:</span>
                    <NumberBadge number={9} onClick={setSelectedNumber} size="sm" />
                  </div>
                  <div className="flex gap-1">
                    <span className="text-xs text-gray-600">Exp:</span>
                    <NumberBadge number={3} onClick={setSelectedNumber} size="sm" />
                  </div>
                  <div className="flex gap-1">
                    <span className="text-xs text-gray-600">Soul:</span>
                    <NumberBadge number={11} onClick={setSelectedNumber} size="sm" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs font-semibold text-green-900 mb-2">Kenneth</p>
                <div className="space-y-1">
                  <div className="flex gap-1">
                    <span className="text-xs text-gray-600">LP:</span>
                    <NumberBadge number={11} onClick={setSelectedNumber} size="sm" />
                  </div>
                  <div className="flex gap-1">
                    <span className="text-xs text-gray-600">Exp:</span>
                    <NumberBadge number={5} onClick={setSelectedNumber} size="sm" />
                  </div>
                  <div className="flex gap-1">
                    <span className="text-xs text-gray-600">Soul:</span>
                    <NumberBadge number={11} onClick={setSelectedNumber} size="sm" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong className="text-gray-900">Stephen</strong> inherits John Francis's <NumberBadge number={7} onClick={setSelectedNumber} size="sm" /> 
                and Mary Agnes's <NumberBadge number={7} onClick={setSelectedNumber} size="sm" />—a double wisdom line from both grandparents.
              </p>
              <p>
                <strong className="text-gray-900">David</strong> carries Mary Agnes's <NumberBadge number={9} onClick={setSelectedNumber} size="sm" /> 
                life path of humanitarian service and John Francis's <NumberBadge number={9} onClick={setSelectedNumber} size="sm" /> expression—
                the completer and healer of cycles.
              </p>
              <p>
                <strong className="text-gray-900">Kenneth</strong> embodies the master <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> 
                (both life path and soul urge) flowing from Thomas Francis's <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> 
                expression and John Francis's legacy—a triple master visionary channel.
              </p>
              <p className="text-amber-900 font-semibold">
                All three brothers carry the <NumberBadge number={8} onClick={setSelectedNumber} size="sm" /> power through Mary Agnes's expression, 
                Elizabeth JoAnn's birthday, and Stephen's soul urge—the family's unified force for achievement.
              </p>
            </div>
          </div>
        </div>

        {/* The Legacy Flow */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Legacy Flow Through Generations</h2>
          
          <div className="space-y-6">
            <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={7} onClick={setSelectedNumber} size="lg" />
                <h3 className="text-xl font-bold text-gray-900">The Wisdom Line</h3>
              </div>
              <p className="text-gray-700">
                John Francis (Life Path 7) → Stephen (Life Path 7) → Christian (Birthday 25/7)
                <br />
                <span className="text-sm italic">An unbroken line of seekers, analysts, and truth-finders</span>
              </p>
            </div>

            <div className="p-6 bg-purple-50 rounded-lg border-l-4 border-purple-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={11} onClick={setSelectedNumber} size="lg" />
                <NumberBadge number={22} onClick={setSelectedNumber} size="lg" />
                <h3 className="text-xl font-bold text-gray-900">The Master Builder Channel</h3>
              </div>
              <p className="text-gray-700">
                John Francis (Soul Urge 22, Birthday 22) → Stephen (Expression 11) → Christian (Soul Urge 11)
                <br />
                <span className="text-sm italic">The power to manifest visions into reality</span>
              </p>
            </div>

            <div className="p-6 bg-pink-50 rounded-lg border-l-4 border-pink-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={33} onClick={setSelectedNumber} size="lg" />
                <h3 className="text-xl font-bold text-gray-900">The Healing Thread</h3>
              </div>
              <p className="text-gray-700">
                Elizabeth JoAnn (Soul Urge 33/6) → Melanie (Soul Urge 33/6) → Future generations
                <br />
                <span className="text-sm italic">The master teacher and healer energy flowing through the maternal line</span>
              </p>
            </div>

            <div className="p-6 bg-orange-50 rounded-lg border-l-4 border-orange-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={8} onClick={setSelectedNumber} size="lg" />
                <h3 className="text-xl font-bold text-gray-900">The Achievement Power</h3>
              </div>
              <p className="text-gray-700">
                Elizabeth JoAnn (Birthday 26/8) → Stephen (Soul Urge 8) → Christian (Double 8)
                <br />
                <span className="text-sm italic">The family's collective power to build and achieve lasting impact</span>
              </p>
            </div>
          </div>
        </div>

        {/* What This Means */}
        <div className="mb-12 p-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl border-2 border-amber-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What This Foundation Means</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
            <p>
              John Francis and Elizabeth JoAnn built a numerological foundation of extraordinary power. 
              Their combination of master numbers (22, 33, 11) creates a spiritual architecture that 
              supports all future generations.
            </p>
            <p>
              Stephen stands as the bridge—inheriting his father's <NumberBadge number={7} onClick={setSelectedNumber} /> wisdom, 
              his mother's <NumberBadge number={8} onClick={setSelectedNumber} /> power, and carrying the 
              <NumberBadge number={11} onClick={setSelectedNumber} /> master intuitive gift forward to his children.
            </p>
            <p className="text-gray-900 font-bold text-xl">
              This is not just a family—this is a lineage of visionaries, builders, and healers whose numbers 
              prove they were meant to leave a lasting impact on the world.
            </p>
          </div>
        </div>

        {/* Closing Quote */}
        <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-gray-200">
          <blockquote className="text-xl italic text-gray-700 mb-4">
            "From the wisdom of John Francis and the healing love of Elizabeth JoAnn, 
            through Stephen's bridge of vision, flows a legacy of master numbers that will echo through eternity."
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