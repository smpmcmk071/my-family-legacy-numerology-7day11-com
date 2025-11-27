import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Heart, BookOpen, Star, Globe, History, Users, Gift, Mail } from 'lucide-react';

export default function AboutNumerology() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-amber-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              About This Project
            </h1>
            <Sparkles className="w-10 h-10 text-amber-400" />
          </div>
          <p className="text-xl text-gray-300 italic">
            Ancient Wisdom Meets Family Legacy
          </p>
        </div>

        {/* Welcome */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-400" />
              Welcome to Your Numerology Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>
              This app was created to help families explore who they are through the ancient lens of numerology. 
              Discover the invisible threads that connect you across generations and see how your individual numbers 
              weave together into a greater family tapestry.
            </p>
            <p>
              Numbers aren't just mathematical symbols—they're the language of the universe. 
              Every birth date, every name carries a vibration, a meaning that ancient cultures understood deeply. 
              Now you can bring that wisdom into your modern family life.
            </p>
            <p>
              Whether it's understanding why certain family members naturally connect, why some are drawn to leadership 
              while others are healers, or simply having fun with the games and predictions—this app is meant to spark 
              conversations, create connections, and honor the legacy you're building together.
            </p>
          </CardContent>
        </Card>

        {/* Ancient Systems */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <History className="w-6 h-6 text-amber-400" />
              The Ancient Systems of Numerology
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-300">
            <p>
              Numerology is one of humanity's oldest forms of divination and self-understanding. 
              Civilizations across the globe independently discovered that numbers carry meaning beyond mere counting.
            </p>

            {/* Pythagorean */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold text-amber-400 mb-2 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Pythagorean (Western) System
              </h3>
              <p className="mb-2">
                Developed by the Greek philosopher Pythagoras around 500 BCE, this is the most widely used system in the Western world. 
                Pythagoras believed that "all things are numbers" and that the universe could be understood through mathematical principles.
              </p>
              <p>
                The Pythagorean system assigns numbers 1-9 to letters A-Z in sequence (A=1, B=2... I=9, J=1, K=2...). 
                This system is excellent for understanding your outward expression and life path.
              </p>
            </div>

            {/* Chaldean */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold text-purple-400 mb-2 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Chaldean (Eastern) System
              </h3>
              <p className="mb-2">
                The older of the two major systems, originating in ancient Babylon (modern-day Iraq) around 4000 BCE. 
                The Chaldeans were master astrologers and mathematicians who saw numbers as sacred vibrations.
              </p>
              <p>
                Unlike Pythagorean, Chaldean numerology only uses numbers 1-8 (9 was considered sacred and never assigned to letters). 
                Assignments are based on the vibration and energy of each letter rather than alphabetical order. 
                This system is considered more mystical and is said to reveal deeper spiritual truths.
              </p>
            </div>

            {/* Hebrew/Gematria */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Hebrew Gematria
              </h3>
              <p className="mb-2">
                An ancient Jewish system where each Hebrew letter has a numerical value. Gematria has been used for thousands of years 
                to find hidden connections between words, names, and sacred texts—particularly the Torah.
              </p>
              <p>
                Words with the same numerical value are believed to share a spiritual connection. This system reveals the deeper, 
                mystical meanings encoded in names and words, connecting the individual to the divine.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Core Numbers */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-green-400" />
              Understanding the Core Numbers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-amber-500/20 rounded-lg border border-amber-500/30">
                <h4 className="font-semibold text-amber-300 mb-1">Life Path Number</h4>
                <p className="text-sm">Your life's purpose and the path you're meant to walk. Derived from your full birth date.</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <h4 className="font-semibold text-purple-300 mb-1">Expression/Destiny Number</h4>
                <p className="text-sm">Your natural talents and abilities. Calculated from all letters in your full name.</p>
              </div>
              <div className="p-3 bg-pink-500/20 rounded-lg border border-pink-500/30">
                <h4 className="font-semibold text-pink-300 mb-1">Soul Urge Number</h4>
                <p className="text-sm">Your inner desires and what truly motivates you. Derived from the vowels in your name.</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <h4 className="font-semibold text-blue-300 mb-1">Personality Number</h4>
                <p className="text-sm">How others perceive you. Calculated from the consonants in your name.</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                <h4 className="font-semibold text-green-300 mb-1">Birthday Number</h4>
                <p className="text-sm">A special talent or gift you bring to your life path. Simply the day you were born.</p>
              </div>
              <div className="p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                <h4 className="font-semibold text-red-300 mb-1">Karmic Numbers</h4>
                <p className="text-sm">Lessons from past lives you're here to learn (13, 14, 16, 19).</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Master Numbers */}
        <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm border-purple-500/30 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-400" />
              The Sacred Master Numbers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>
              Master numbers (11, 22, 33, and beyond) are never reduced to single digits because they carry amplified spiritual significance. 
              They represent higher octaves of their base numbers and indicate souls with important missions.
            </p>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="p-3 bg-white/10 rounded-lg text-center">
                <span className="text-3xl font-bold text-amber-400">11</span>
                <p className="text-sm mt-1">The Visionary<br/>Intuition & Illumination</p>
              </div>
              <div className="p-3 bg-white/10 rounded-lg text-center">
                <span className="text-3xl font-bold text-purple-400">22</span>
                <p className="text-sm mt-1">The Master Builder<br/>Manifestation & Legacy</p>
              </div>
              <div className="p-3 bg-white/10 rounded-lg text-center">
                <span className="text-3xl font-bold text-pink-400">33</span>
                <p className="text-sm mt-1">The Master Teacher<br/>Healing & Compassion</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 italic text-center">
              Higher master numbers (44, 55, 66, 77, 88, 99) appear more rarely and carry even greater spiritual responsibility.
            </p>
          </CardContent>
        </Card>

        {/* Your Family's Journey */}
        <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-sm border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-400" />
              Your Family's Numerological Tapestry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>
              What makes your family special isn't just the individual numbers you carry—it's how they weave together. 
              The master numbers that flow through your lineage, the karmic patterns you share, and the elemental balance 
              you create together all point to a family with purpose.
            </p>
            <p>
              Start by adding yourself and your family members to discover your core numbers. Watch as patterns emerge—
              the wisdom seekers, the master builders, the healers, and the visionaries. Each person plays a vital role 
              in your family's greater story.
            </p>
            <p className="text-amber-300 font-medium">
              May this app bring insight, connection, and a little bit of fun to your family for generations to come.
            </p>
          </CardContent>
        </Card>

        {/* Order Personalized Report */}
        <Card className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-sm border-purple-500/30 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Gift className="w-6 h-6 text-pink-400" />
              Order a Personalized Family Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>
              Want a deep dive into your family's numerological legacy? Order a personalized report that includes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Full numerology analysis for each family member</li>
              <li>Family tree with numerological connections highlighted</li>
              <li>Master number lineage tracking across generations</li>
              <li>Karmic patterns and lessons flowing through your bloodline</li>
              <li>Compatibility analysis between family members</li>
              <li>Personalized recommendations for family harmony</li>
            </ul>
            <div className="pt-4 border-t border-white/10">
              <p className="text-white font-medium mb-3">Contact us to order:</p>
              <a 
                href="mailto:support@7day11.com?subject=Personalized Family Numerology Report"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4" />
                support@7day11.com
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}