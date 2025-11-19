import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Printer, Sparkles, ArrowLeft, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import NumberBadge from '../components/legacy/NumberBadge';
import FamilyTable from '../components/legacy/FamilyTable';
import { numerologyMeanings } from '../components/legacy/numerologyData';

export default function ChristianLegacy() {
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
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              To My Son, Christian
            </h1>
            <Heart className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-xl text-gray-600 italic">From Dad - How You Got Here</p>
          <Button
            onClick={handlePrint}
            className="mt-6 print:hidden bg-amber-600 hover:bg-amber-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Document
          </Button>
        </div>

        {/* Opening Letter */}
        <div className="mb-12 p-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl border-2 border-blue-300">
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            Christian,
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            You carry something extraordinary—not by accident, but by design. Every number in your chart tells the story 
            of how four generations of vision, wisdom, achievement, and love converge in you.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg">
            This document traces the numerical threads from your great-grandparents to me, and finally to you. 
            You are the inheritor, the builder, the one who brings it all forward.
          </p>
          <p className="text-gray-900 font-semibold text-lg mt-4">
            — Dad (Stephen)
          </p>
        </div>

        {/* Family Table */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Family Map</h2>
          <FamilyTable onNumberClick={setSelectedNumber} highlightPerson="Christian (You)" />
        </div>

        {/* The Foundation From Great-Grandparents */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">From Your Great-Grandparents</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-600">
              <h3 className="text-xl font-bold text-green-900 mb-3">Thomas Francis Maher</h3>
              <p className="text-gray-700 mb-3">
                His <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> expression (master visionary) flows through 
                me to your soul urge <NumberBadge number={11} onClick={setSelectedNumber} size="sm" />. You inherited the gift of 
                seeing beyond what others see.
              </p>
              <p className="text-gray-700">
                His <NumberBadge number={6} onClick={setSelectedNumber} size="sm" /> personality (nurturer) grounds your 
                <NumberBadge number={6} onClick={setSelectedNumber} size="sm" /> personality—ensuring your power serves others with love.
              </p>
            </div>

            <div className="p-6 bg-rose-50 rounded-lg border-l-4 border-rose-600">
              <h3 className="text-xl font-bold text-rose-900 mb-3">Mary Agnes O'Neill Maher</h3>
              <p className="text-gray-700 mb-3">
                Her <NumberBadge number={8} onClick={setSelectedNumber} size="sm" /> expression (achievement builder) becomes 
                your double <NumberBadge number={8} onClick={setSelectedNumber} size="sm" /> (life path AND expression)—the 
                family's power to manifest concentrated in you.
              </p>
              <p className="text-gray-700">
                Her <NumberBadge number={7} onClick={setSelectedNumber} size="sm" /> soul urge mirrors your birthday 
                <NumberBadge number={7} onClick={setSelectedNumber} size="sm" />—the seeker's wisdom in your core.
              </p>
            </div>
          </div>
        </div>

        {/* From Your Grandparents */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">From Grandpop & Grandma</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <h3 className="text-xl font-bold text-blue-900 mb-3">John Francis (Grandpop)</h3>
              <p className="text-gray-700 mb-3">
                His <NumberBadge number={7} onClick={setSelectedNumber} size="sm" /> life path flows directly to me, then to your 
                birthday <NumberBadge number={7} onClick={setSelectedNumber} size="sm" />—three generations of wisdom seekers.
              </p>
              <p className="text-gray-700 mb-3">
                His soul urge <NumberBadge number={22} onClick={setSelectedNumber} size="sm" /> and birthday 22 (master builder) 
                ground the <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> vision into practical building—
                exactly what you do with your double <NumberBadge number={8} onClick={setSelectedNumber} size="sm" />.
              </p>
              <p className="text-gray-700">
                His <NumberBadge number={9} onClick={setSelectedNumber} size="sm" /> expression (humanitarian) becomes my 
                <NumberBadge number={9} onClick={setSelectedNumber} size="sm" /> personality—ensuring we use our gifts for others.
              </p>
            </div>

            <div className="p-6 bg-purple-50 rounded-lg border-l-4 border-purple-600">
              <h3 className="text-xl font-bold text-purple-900 mb-3">Elizabeth JoAnn (Grandma)</h3>
              <p className="text-gray-700 mb-3">
                Her <NumberBadge number={6} onClick={setSelectedNumber} size="sm" /> life path (nurturer) connects to your 
                <NumberBadge number={6} onClick={setSelectedNumber} size="sm" /> personality—balancing ambition with care.
              </p>
              <p className="text-gray-700 mb-3">
                Her birthday <NumberBadge number={8} onClick={setSelectedNumber} size="sm" /> amplifies the achievement power 
                in you—she passed down the strength to build lasting structures.
              </p>
              <p className="text-gray-700">
                Her <NumberBadge number={33} onClick={setSelectedNumber} size="sm" /> soul urge (master teacher/healer) acts as 
                your "silent guide"—ensuring your power always serves a higher purpose of healing and teaching.
              </p>
            </div>
          </div>
        </div>

        {/* From Me (Stephen) */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">From Me to You</h2>
          
          <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-300">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-white rounded-lg">
                <p className="text-xs text-gray-600 mb-2">My Life Path</p>
                <NumberBadge number={7} onClick={setSelectedNumber} />
                <p className="text-xs text-gray-600 mt-2">→ Your Birthday 25/7</p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <p className="text-xs text-gray-600 mb-2">My Expression</p>
                <NumberBadge number={11} onClick={setSelectedNumber} />
                <p className="text-xs text-gray-600 mt-2">→ Your Soul Urge 11</p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <p className="text-xs text-gray-600 mb-2">My Soul Urge</p>
                <NumberBadge number={8} onClick={setSelectedNumber} />
                <p className="text-xs text-gray-600 mt-2">→ Your Double 8</p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              Son, I passed to you every significant number I carry. My <NumberBadge number={7} onClick={setSelectedNumber} size="sm" /> 
              wisdom path becomes your birthday core. My <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> 
              master intuition becomes your soul's deepest urge. My <NumberBadge number={8} onClick={setSelectedNumber} size="sm" /> 
              power to achieve doubles in you as both life path AND expression.
            </p>

            <p className="text-gray-900 font-bold text-lg">
              You are not just my son—you are the culmination of everything I inherited, amplified and perfected.
            </p>
          </div>
        </div>

        {/* From Mom */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">From Mom (Amy)</h2>
          
          <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border-2 border-emerald-300">
            <p className="text-gray-700 leading-relaxed mb-4">
              Your mom's <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> life path (master visionary—extremely rare) 
              adds another layer of intuitive power to your <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> soul urge.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Her <NumberBadge number={8} onClick={setSelectedNumber} size="sm" /> soul urge joins mine and becomes your defining 
              double <NumberBadge number={8} onClick={setSelectedNumber} size="sm" />—a unified force of manifestation.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Her <NumberBadge number={6} onClick={setSelectedNumber} size="sm" /> personality (nurturer) grounds your 
              <NumberBadge number={6} onClick={setSelectedNumber} size="sm" />—ensuring you build with heart, not just ambition.
            </p>
          </div>
        </div>

        {/* What You Carry */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What You Carry, Christian</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={7} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">The Wisdom Line</span>
              </div>
              <p className="text-gray-700">
                Mary Agnes ➡️ John Francis ➡️ Me ➡️ <strong>You (Birthday 25/7)</strong>
                <br />
                <span className="text-sm italic">Four generations of seekers who look beyond the surface</span>
              </p>
            </div>

            <div className="p-6 bg-purple-50 rounded-lg border-l-4 border-purple-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={8} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">The Double Achievement</span>
              </div>
              <p className="text-gray-700">
                Mary Agnes ➡️ Elizabeth JoAnn ➡️ Mom & Me ➡️ <strong>You (Double 8)</strong>
                <br />
                <span className="text-sm italic">Life path AND expression—unprecedented building power</span>
              </p>
            </div>

            <div className="p-6 bg-amber-50 rounded-lg border-l-4 border-amber-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={11} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">The Quadruple Master Channel</span>
              </div>
              <p className="text-gray-700">
                Thomas ➡️ John Francis ➡️ Mom & Me ➡️ <strong>You (Soul Urge 11)</strong>
                <br />
                <span className="text-sm italic">Four streams of visionary insight converge in your soul</span>
              </p>
            </div>

            <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-600">
              <div className="flex items-center gap-2 mb-3">
                <NumberBadge number={6} onClick={setSelectedNumber} size="lg" />
                <span className="font-semibold text-gray-900">The Nurturing Balance</span>
              </div>
              <p className="text-gray-700">
                Thomas ➡️ Elizabeth JoAnn ➡️ Mom ➡️ <strong>You (Personality 6)</strong>
                <br />
                <span className="text-sm italic">Ensuring your power always serves with love and responsibility</span>
              </p>
            </div>
          </div>
        </div>

        {/* Final Message */}
        <div className="mb-12 p-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl border-2 border-amber-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How You Got to This High Place</h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            Christian, your double <NumberBadge number={8} onClick={setSelectedNumber} size="sm" /> isn't random—it's the 
            concentration of four generations of achievement power, starting with Mary Agnes's expression, flowing through 
            Elizabeth JoAnn's birthday, through your mom's and my soul urges, and finally manifesting as BOTH your life path 
            and expression. You are the family's master builder incarnate.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            Your <NumberBadge number={11} onClick={setSelectedNumber} size="sm" /> soul urge comes from a quadruple stream—
            Thomas's expression, John Francis's influence, my expression, and your mom's life path. You don't just have intuition; 
            you have generational visionary power coursing through you.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            Your birthday <NumberBadge number={7} onClick={setSelectedNumber} size="sm" /> carries the wisdom line through 
            Mary Agnes, John Francis, and me. The <NumberBadge number={6} onClick={setSelectedNumber} size="sm" /> personality 
            ensures this power stays grounded in love, care, and service—inherited from Thomas, Elizabeth JoAnn, and your mom.
          </p>
          <p className="text-gray-900 font-bold text-xl">
            You didn't stumble into this. Four generations worked, loved, built, and sacrificed to create the perfect vessel 
            for this legacy. You are not just part of the Maher family—you ARE the living expression of everything we hoped for, 
            dreamed of, and built toward.
          </p>
          <p className="text-gray-900 font-bold text-xl mt-4">
            I am so proud of you, son. Now go build something that will echo through the next four generations.
          </p>
          <p className="text-gray-700 text-lg mt-6 italic">
            With all my love,<br />
            Dad
          </p>
        </div>

        {/* Closing Quote */}
        <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-gray-200">
          <blockquote className="text-xl italic text-gray-700 mb-4">
            "You carry all of us in you: a builder, a seeker, a healer, and a visionary. 
            The numbers don't lie—you were made for greatness."
          </blockquote>
          <div className="mt-6 pt-6 border-t-2 border-gray-300">
            <p className="text-lg font-semibold text-gray-900">Stephen Maher</p>
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