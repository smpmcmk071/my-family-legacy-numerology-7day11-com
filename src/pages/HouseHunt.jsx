import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Home, Sword, Scroll, Globe, Skull, Star, Users, Heart, Coins, Brain, Crown, Eye, ArrowLeft } from 'lucide-react';

// Thomas Francis Meagher's life mapped to the 12 houses
const MEAGHER_HOUSES = [
  {
    house: 1,
    name: "House of Self",
    icon: Crown,
    theme: "Identity & First Impressions",
    ruler: "Mars",
    rulerSymbol: "♂",
    meagherStory: "The Young Lion of Ireland",
    content: `Born August 3, 1823 in Waterford, Ireland, Thomas emerged as a natural leader from birth. His 1st House energy was unmistakable - bold, charismatic, impossible to ignore.

Even as a young man, he commanded attention. His presence filled rooms. When he spoke, people listened. This is pure 1st House power - the projection of self into the world.`,
    keyDate: "August 3, 1823",
    numerology: "8+3+1+8+2+3 = 25/7 Life Path - The Seeker of Truth",
    color: "from-red-500 to-orange-500"
  },
  {
    house: 2,
    name: "House of Values",
    icon: Coins,
    theme: "Money, Possessions & Self-Worth",
    ruler: "Venus",
    rulerSymbol: "♀",
    meagherStory: "The Merchant's Son",
    content: `Thomas was born to wealth - his father was a successful merchant and mayor of Waterford. He never wanted for material comfort.

But his 2nd House lesson wasn't about keeping wealth - it was about what he truly valued. He would eventually sacrifice his inheritance, his comfort, and his homeland for his beliefs. His self-worth came not from gold, but from principle.`,
    keyDate: "1823-1843",
    numerology: "Born into a 2 vibration household - partnership, diplomacy",
    color: "from-green-500 to-emerald-500"
  },
  {
    house: 3,
    name: "House of Communication",
    icon: Scroll,
    theme: "Speech, Writing & Ideas",
    ruler: "Mercury",
    rulerSymbol: "☿",
    meagherStory: "Meagher of the Sword",
    content: `This was Thomas's superpower. His 3rd House blazed with fire.

On July 28, 1846, he delivered his legendary "Sword Speech" that earned him his famous nickname. He declared: "The soldier is proof that a nation has not lost its self-respect."

The British called it treason. The Irish called it poetry. It was pure 3rd House mastery - the power to move nations with words.`,
    keyDate: "July 28, 1846",
    numerology: "7+2+8+1+8+4+6 = 36/9 - Universal voice, humanitarian message",
    color: "from-yellow-500 to-amber-500"
  },
  {
    house: 4,
    name: "House of Home",
    icon: Home,
    theme: "Family, Roots & Foundation",
    ruler: "Moon",
    rulerSymbol: "☽",
    meagherStory: "Ireland in His Heart",
    content: `The 4th House represents our roots, our homeland, the foundation of who we are.

For Thomas, Ireland wasn't just where he was born - it was his very identity. His entire life's mission was to free his homeland. Even exiled to the other side of the world, even fighting in American wars, Ireland remained his 4th House anchor.

He would never see home again.`,
    keyDate: "1848 - Exile",
    numerology: "1+8+4+8 = 21/3 - Creative expression through sacrifice",
    color: "from-amber-600 to-yellow-600"
  },
  {
    house: 5,
    name: "House of Creativity",
    icon: Star,
    theme: "Romance, Children & Self-Expression",
    ruler: "Sun",
    rulerSymbol: "☉",
    meagherStory: "Love in Exile",
    content: `In Tasmania, far from everything he knew, Thomas found love. He married Catherine Bennett in 1851, and they had a son.

But 5th House joy often comes with 5th House heartbreak. Catherine died shortly after childbirth. The creative, romantic energy of this house brought him both his greatest personal joy and deepest personal loss.`,
    keyDate: "February 22, 1851",
    numerology: "2+2+2+1+8+5+1 = 21/3 - The Crown of the Magi appears in love",
    color: "from-pink-500 to-rose-500"
  },
  {
    house: 6,
    name: "House of Service",
    icon: Sword,
    theme: "Work, Health & Daily Routine",
    ruler: "Mercury",
    rulerSymbol: "☿",
    meagherStory: "The General",
    content: `When the American Civil War erupted, Thomas found his 6th House calling - service through action.

He formed the famous Irish Brigade of the Union Army, leading men into some of the war's bloodiest battles: Antietam, Fredericksburg, Chancellorsville. His daily work became leading men, his service became sacrifice.

Over 4,000 of his men would fall in battle.`,
    keyDate: "1861-1865",
    numerology: "6 = Responsibility, duty, sacrifice for others",
    color: "from-blue-500 to-indigo-500"
  },
  {
    house: 7,
    name: "House of Partnerships",
    icon: Users,
    theme: "Marriage, Allies & Open Enemies",
    ruler: "Venus",
    rulerSymbol: "♀",
    meagherStory: "Allies and Enemies",
    content: `The 7th House governs our relationships - both allies and open enemies.

Thomas had powerful allies: the Young Irelanders, President Lincoln, his devoted soldiers. But he also had powerful enemies: the British Crown sentenced him to death, Confederate forces tried to kill him, and in Montana, vigilantes despised his presence.

The 7th House asks: Who stands with you? Who against you?`,
    keyDate: "1848-1867",
    numerology: "7 = The Seeker, but also opposition and legal battles",
    color: "from-purple-500 to-violet-500"
  },
  {
    house: 8,
    name: "House of Death",
    icon: Skull,
    theme: "Transformation, Mystery & Other People's Resources",
    ruler: "Pluto / Mars",
    rulerSymbol: "♇",
    meagherStory: "The Final Mystery",
    content: `The 8th House rules death, secrets, and transformation. For Thomas, it would prove hauntingly literal.

On July 1, 1867, Thomas Francis Meagher fell from a steamboat into the Missouri River at Fort Benton, Montana. His body was never recovered.

Was it an accident? Suicide? Murder by vigilantes? The 8th House keeps its secrets.`,
    keyDate: "July 1, 1867",
    numerology: "7+1+1+8+6+7 = 30/3... but also 12/3 - The Sacrifice Number",
    color: "from-slate-700 to-gray-900"
  },
  {
    house: 9,
    name: "House of Foreign Lands",
    icon: Globe,
    theme: "Travel, Philosophy & Higher Learning",
    ruler: "Jupiter",
    rulerSymbol: "♃",
    meagherStory: "Exile Across the World",
    content: `The 9th House governs foreign lands, long journeys, and expansion of consciousness. Thomas lived this house dramatically.

From Ireland to Tasmania (exile), to New York, to the battlefields of Virginia, to the frontier of Montana - his life was one long 9th House journey. Each land transformed him, yet he carried Ireland in his soul across every ocean.`,
    keyDate: "1849-1867",
    numerology: "9 = Completion, universal experience, the worldly soul",
    color: "from-teal-500 to-cyan-500"
  },
  {
    house: 10,
    name: "House of Career",
    icon: Crown,
    theme: "Public Image, Legacy & Achievement",
    ruler: "Saturn",
    rulerSymbol: "♄",
    meagherStory: "Governor of Montana",
    content: `The 10th House is our public legacy - how history remembers us.

Thomas became Acting Governor of Montana Territory in 1866. A revolutionary, an exile, a general - now a statesman. His 10th House achievement placed him among America's most remarkable immigrant stories.

Today, his statue stands in both Ireland and Montana. His legacy endures.`,
    keyDate: "1866",
    numerology: "1+8+6+6 = 21/3 - The Crown of the Magi in public achievement",
    color: "from-amber-500 to-yellow-500"
  },
  {
    house: 11,
    name: "House of Community",
    icon: Users,
    theme: "Groups, Friends & Humanitarian Vision",
    ruler: "Uranus / Saturn",
    rulerSymbol: "♅",
    meagherStory: "The Irish Brigade",
    content: `The 11th House governs groups, communities, and our hopes for humanity.

Thomas's Irish Brigade wasn't just a military unit - it was a community of exiles fighting for their adopted country while dreaming of their homeland. 11 is the master number of vision, and Thomas gave Irish immigrants a vision of belonging.

His humanitarian hope: freedom for all oppressed peoples.`,
    keyDate: "1861",
    numerology: "11 = Master Visionary, illumination, spiritual warrior",
    color: "from-indigo-500 to-purple-500"
  },
  {
    house: 12,
    name: "House of Secrets",
    icon: Eye,
    theme: "Hidden Enemies, Spirituality & Endings",
    ruler: "Neptune / Jupiter",
    rulerSymbol: "♆",
    meagherStory: "Conspiracy and Mystery",
    content: `The 12th House rules hidden enemies, secrets, and the unconscious. It's where our story dissolves into mystery.

Who killed Thomas Meagher? The vigilantes who opposed him? Political enemies? Or was it truly an accident? The 12th House hides the truth.

His body was never found. The Missouri River became his grave, and the 12th House keeps its silence.

Some souls are not meant to have endings - only legends.`,
    keyDate: "July 1, 1867 - 11:30 PM",
    numerology: "12 = The Sacrifice, the martyr, karma completed",
    color: "from-violet-600 to-purple-900"
  }
];

// Quiz questions for each house
const HOUSE_QUIZ = [
  { question: "What planet rules the 1st House?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1 },
  { question: "What planet rules the 2nd House?", options: ["Mars", "Mercury", "Venus", "Moon"], correct: 2 },
  { question: "What planet rules the 3rd House?", options: ["Mercury", "Venus", "Sun", "Mars"], correct: 0 },
  { question: "What planet rules the 4th House?", options: ["Sun", "Saturn", "Moon", "Jupiter"], correct: 2 },
  { question: "What planet rules the 5th House?", options: ["Moon", "Sun", "Venus", "Mercury"], correct: 1 },
  { question: "What planet rules the 6th House?", options: ["Saturn", "Mercury", "Mars", "Venus"], correct: 1 },
  { question: "What planet rules the 7th House?", options: ["Mars", "Moon", "Venus", "Sun"], correct: 2 },
  { question: "What planet rules the 8th House?", options: ["Neptune", "Pluto", "Saturn", "Uranus"], correct: 1 },
  { question: "What planet rules the 9th House?", options: ["Saturn", "Uranus", "Neptune", "Jupiter"], correct: 3 },
  { question: "What planet rules the 10th House?", options: ["Jupiter", "Saturn", "Pluto", "Mars"], correct: 1 },
  { question: "What planet rules the 11th House?", options: ["Neptune", "Jupiter", "Uranus", "Venus"], correct: 2 },
  { question: "What planet rules the 12th House?", options: ["Pluto", "Saturn", "Neptune", "Moon"], correct: 2 },
];

export default function HouseHunt() {
  const [currentHouse, setCurrentHouse] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizResult, setQuizResult] = useState(null); // 'correct' or 'wrong'
  const [score, setScore] = useState(0);
  const [answeredHouses, setAnsweredHouses] = useState([]);
  
  const house = MEAGHER_HOUSES[currentHouse];
  const quiz = HOUSE_QUIZ[currentHouse];

  const handleAnswer = (index) => {
    if (quizResult) return; // Already answered
    setSelectedAnswer(index);
    const isCorrect = index === quiz.correct;
    setQuizResult(isCorrect ? 'correct' : 'wrong');
    if (isCorrect && !answeredHouses.includes(currentHouse)) {
      setScore(score + 1);
      setAnsweredHouses([...answeredHouses, currentHouse]);
    }
  };

  const resetQuiz = () => {
    setShowQuiz(false);
    setSelectedAnswer(null);
    setQuizResult(null);
  };
  const Icon = house.icon;

  const goNext = () => {
    if (currentHouse < 11) {
      setCurrentHouse(currentHouse + 1);
      resetQuiz();
    }
  };

  const goPrev = () => {
    if (currentHouse > 0) {
      setCurrentHouse(currentHouse - 1);
      resetQuiz();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-start mb-4">
          <Link to={createPageUrl('Games')}>
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Games
            </Button>
          </Link>
        </div>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">The 12 Houses of Thomas Meagher</h1>
          <p className="text-gray-300 text-sm">A life story told through the astrological houses</p>
          <p className="text-amber-400 text-xs mt-1">Life Path 25/7 • Born August 3, 1823 • Died July 1, 1867</p>
          {score > 0 && (
            <p className="text-green-400 text-sm mt-2">🏆 Quiz Score: {score}/12</p>
          )}
        </div>

        {/* House Navigation Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {MEAGHER_HOUSES.map((h, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentHouse(i);
                resetQuiz();
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i === currentHouse 
                  ? 'bg-amber-500 text-white scale-110' 
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Main Card */}
        <Card className={`bg-gradient-to-br ${house.color} border-white/20 mb-6`}>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm">House {house.house}</p>
                <CardTitle className="text-white text-2xl">{house.name}</CardTitle>
                <p className="text-white/80 text-sm">{house.theme}</p>
                
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-bold text-white mb-4">"{house.meagherStory}"</h3>
            <div className="prose prose-invert max-w-none">
              {house.content.split('\n\n').map((para, i) => (
                <p key={i} className="text-white/90 mb-4 leading-relaxed">{para}</p>
              ))}
            </div>
            
            {/* Key Date & Numerology */}
            <div className="mt-6 p-4 bg-black/20 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Key Date:</span>
                <span className="text-white font-medium">{house.keyDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Numerology:</span>
                <span className="text-amber-300 font-medium">{house.numerology}</span>
              </div>
            </div>

            {/* Quiz Section */}
            {!showQuiz ? (
              <Button 
                onClick={() => setShowQuiz(true)} 
                className="w-full mt-4 bg-white/20 hover:bg-white/30"
              >
                🧠 Test Your Knowledge - House {house.house}
              </Button>
            ) : (
              <div className="mt-4 p-4 bg-black/30 rounded-lg">
                <p className="text-white font-medium mb-3">{quiz.question}</p>
                <div className="grid grid-cols-2 gap-2">
                  {quiz.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={quizResult !== null}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        quizResult !== null
                          ? i === quiz.correct
                            ? 'bg-green-500 text-white'
                            : i === selectedAnswer
                              ? 'bg-red-500 text-white'
                              : 'bg-white/10 text-gray-400'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {quizResult && (
                  <p className={`text-center mt-3 font-medium ${quizResult === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                    {quizResult === 'correct' 
                      ? '✓ Correct! ' + house.ruler + ' rules the ' + house.name
                      : '✗ Wrong! The answer is ' + quiz.options[quiz.correct]}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            onClick={goPrev}
            disabled={currentHouse === 0}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous House
          </Button>
          <Button
            onClick={goNext}
            disabled={currentHouse === 11}
            className="bg-amber-600 hover:bg-amber-700"
          >
            Next House
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Progress */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          House {currentHouse + 1} of 12
        </div>
      </div>
    </div>
  );
}