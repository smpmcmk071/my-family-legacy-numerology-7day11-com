import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Rocket, Crown, Zap, ArrowLeft, TrendingUp, BookOpen } from 'lucide-react';

const STORIES = [
  {
    name: 'Thomas Francis Meagher',
    subtitle: 'The Young Lion of Ireland',
    lifePath: '25/7 - The Seeker of Truth',
    zodiac: 'Leo',
    birth: 'August 3, 1823',
    death: 'July 1, 1867',
    tagline: 'Irish revolutionary, Civil War general, Montana legend',
    icon: Crown,
    page: 'HouseHuntMeagher',
    gradient: 'from-green-500 via-orange-500 to-red-600',
    preview: 'From the streets of Waterford to the battlefields of Virginia to the mysteries of Montana - a life that defied empires and defined courage.'
  },
  {
    name: 'Elon Musk',
    subtitle: 'The Visionary\'s Orbit',
    lifePath: '34/7 - The Intuitive Seeker',
    zodiac: 'Cancer',
    birth: 'June 28, 1971',
    death: null,
    tagline: 'The man who builds bridges to the stars',
    icon: Rocket,
    page: 'HouseHuntElon',
    gradient: 'from-blue-500 via-purple-500 to-pink-600',
    preview: 'From Pretoria to PayPal to Mars - a cosmic journey of innovation, disruption, and interplanetary vision.'
  },
  {
    name: 'Donald J. Trump',
    subtitle: 'The Builder\'s Tower',
    lifePath: '31/4 - The Master Builder',
    zodiac: 'Gemini',
    birth: 'June 14, 1946',
    death: null,
    tagline: 'The man who reshaped empires with words and will',
    icon: Home,
    page: 'HouseHuntTrump',
    gradient: 'from-amber-500 via-yellow-500 to-orange-600',
    preview: 'From Queens to Manhattan to the White House - a controversial journey of towers, deals, and political earthquakes.'
  },
  {
    name: 'Kobe Bryant',
    subtitle: 'The Eternal Mamba',
    lifePath: '38/11 - The Master Illuminator',
    zodiac: 'Leo',
    birth: 'August 23, 1978',
    death: 'January 26, 2020',
    tagline: 'The man who forged immortality on the court',
    icon: Zap,
    page: 'HouseHuntKobe',
    gradient: 'from-purple-500 via-yellow-500 to-purple-700',
    preview: 'From Philadelphia to Italy to Lakers glory - a relentless pursuit of greatness, legacy, and transcendent spirit.'
  },
  {
    name: 'W.D. Gann',
    subtitle: 'The Mystic Trader\'s Wheel',
    lifePath: '36/9 - The Mystic Trader',
    zodiac: 'Gemini',
    birth: 'June 6, 1878',
    death: 'June 18, 1955',
    tagline: 'The man who predicted markets through the stars',
    icon: TrendingUp,
    page: 'HouseHuntGann',
    gradient: 'from-teal-500 via-blue-500 to-purple-600',
    preview: 'From Texas cotton fields to Wall Street prophecy - a mystical journey of geometry, astrology, and hidden market codes.'
  },
  {
    name: 'Isaac Asimov',
    subtitle: 'Stars of Reason',
    lifePath: '15/6 - The Rational Visionary',
    zodiac: 'Capricorn',
    birth: 'January 2, 1920',
    death: 'April 6, 1992',
    tagline: 'The man who explained the universe, one word at a time',
    icon: BookOpen,
    page: 'HouseHuntAsimov',
    gradient: 'from-indigo-500 via-blue-500 to-cyan-600',
    preview: 'From Russian exile to Brooklyn candy stores to 500 books - a rational mind hiding cosmic wonder in science fiction.'
  },
  {
    name: 'Michael Crichton',
    subtitle: 'The Techno-Thriller Titan',
    lifePath: '22/4 - The Master Builder',
    zodiac: 'Scorpio',
    birth: 'October 23, 1942',
    death: 'November 4, 2008',
    tagline: 'The 6\'9" genius who warned us about playing God',
    icon: BookOpen,
    page: 'HouseHuntCrichton',
    gradient: 'from-red-500 via-orange-500 to-yellow-600',
    preview: 'From Harvard med school to Jurassic Park - a master builder of cautionary tales where science meets consequence.'
  },
  {
    name: 'Arthur C. Clarke',
    subtitle: 'The Space Age Prophet',
    lifePath: '28/10/1 - The Futuristic Pioneer',
    zodiac: 'Sagittarius',
    birth: 'December 16, 1917',
    death: 'March 19, 2008',
    tagline: 'The man who invented the satellite and imagined 2001',
    icon: Rocket,
    page: 'HouseHuntClarke',
    gradient: 'from-blue-500 via-indigo-500 to-purple-600',
    preview: 'From English farms to Sri Lankan seas to cosmic visions - the prophet who predicted our connected world.'
  },
  {
    name: 'Dr. Seuss',
    subtitle: 'The Whimsical Word Wizard',
    lifePath: '19/10/1 - Independent Imaginer',
    zodiac: 'Pisces',
    birth: 'March 2, 1904',
    death: 'September 24, 1991',
    tagline: 'The man who made reading an adventure',
    icon: BookOpen,
    page: 'HouseHuntSeuss',
    gradient: 'from-pink-500 via-yellow-500 to-green-600',
    preview: 'From Springfield doodles to Whoville wonders - silly rhymes hiding profound life lessons for generations.'
  },
  {
    name: 'Roald Dahl',
    subtitle: 'The Magical Mischief Maker',
    lifePath: '30/3 - Creative Charmer',
    zodiac: 'Virgo',
    birth: 'September 13, 1916',
    death: 'November 23, 1990',
    tagline: 'The RAF pilot who invented Wonka',
    icon: BookOpen,
    page: 'HouseHuntDahl',
    gradient: 'from-purple-500 via-pink-500 to-red-600',
    preview: 'From Welsh pranks to wartime heroics to chocolate factories - dark magic wrapped in sweet stories.'
  },
  {
    name: 'J.K. Rowling',
    subtitle: 'The Wizarding Wonder Weaver',
    lifePath: '32/5 - Adventurous Author',
    zodiac: 'Leo',
    birth: 'July 31, 1965',
    death: null,
    tagline: 'The woman who conjured Harry Potter on a train',
    icon: Zap,
    page: 'HouseHuntRowling',
    gradient: 'from-amber-500 via-red-600 to-purple-700',
    preview: 'From welfare mother to wizard world architect - seven books that cast a spell on billions.'
  }
];

export default function HouseHunt() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-start mb-6">
          <Link to={createPageUrl('Games')}>
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Games
            </Button>
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">The 12 Houses</h1>
          <p className="text-gray-300 text-lg mb-2">Life Stories Through the Astrological Houses</p>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            Explore legendary lives mapped to the 12 astrological houses. Each journey reveals how the cosmos shaped extraordinary destinies through identity, wealth, communication, legacy, and mystery.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {STORIES.map((story, idx) => {
            const Icon = story.icon;
            return (
              <Link key={idx} to={createPageUrl(story.page)}>
                <Card className={`h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br ${story.gradient} border-white/20 cursor-pointer group`}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-white text-2xl mb-1">{story.name}</CardTitle>
                        <p className="text-white/80 text-sm italic mb-2">{story.subtitle}</p>
                        <p className="text-white/70 text-xs">{story.tagline}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-white/90 text-sm leading-relaxed">{story.preview}</p>
                    
                    <div className="p-3 bg-black/20 rounded-lg space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Life Path:</span>
                        <span className="text-amber-300 font-medium">{story.lifePath}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Zodiac:</span>
                        <span className="text-purple-300 font-medium">{story.zodiac}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Born:</span>
                        <span className="text-white font-medium">{story.birth}</span>
                      </div>
                      {story.death && (
                        <div className="flex justify-between text-xs">
                          <span className="text-white/60">Died:</span>
                          <span className="text-gray-300 font-medium">{story.death}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <Button className="w-full bg-white/20 hover:bg-white/30 text-white">
                        Explore 12 Houses →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
          <h2 className="text-xl font-bold text-white mb-3">About the 12 Houses</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            The 12 Houses of Astrology map every aspect of human experience - from identity to death, from wealth to wisdom. Each house is ruled by a planet and governs a specific life domain.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-400">
            <span>1️⃣ Self & Identity</span>
            <span>2️⃣ Values & Money</span>
            <span>3️⃣ Communication</span>
            <span>4️⃣ Home & Roots</span>
            <span>5️⃣ Creativity & Romance</span>
            <span>6️⃣ Work & Service</span>
            <span>7️⃣ Partnerships</span>
            <span>8️⃣ Death & Transformation</span>
            <span>9️⃣ Travel & Philosophy</span>
            <span>🔟 Career & Legacy</span>
            <span>1️⃣1️⃣ Community & Vision</span>
            <span>1️⃣2️⃣ Secrets & Endings</span>
          </div>
        </div>
      </div>
    </div>
  );
}