import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

// Quiz questions for each house - testing PRIMARY modern rulers
const HOUSE_QUIZ = [
  { question: "What planet rules the 1st House?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1 },
  { question: "What planet rules the 2nd House?", options: ["Mars", "Mercury", "Venus", "Moon"], correct: 2 },
  { question: "What planet rules the 3rd House?", options: ["Mercury", "Venus", "Sun", "Mars"], correct: 0 },
  { question: "What planet rules the 4th House?", options: ["Sun", "Saturn", "Moon", "Jupiter"], correct: 2 },
  { question: "What planet rules the 5th House?", options: ["Moon", "Sun", "Venus", "Mercury"], correct: 1 },
  { question: "What planet rules the 6th House?", options: ["Saturn", "Mercury", "Mars", "Venus"], correct: 1 },
  { question: "What planet rules the 7th House?", options: ["Mars", "Moon", "Venus", "Sun"], correct: 2 },
  { question: "What planet rules the 8th House? (modern)", options: ["Neptune", "Pluto", "Saturn", "Mars"], correct: 1 },
  { question: "What planet rules the 9th House?", options: ["Saturn", "Uranus", "Neptune", "Jupiter"], correct: 3 },
  { question: "What planet rules the 10th House?", options: ["Jupiter", "Saturn", "Pluto", "Mars"], correct: 1 },
  { question: "What planet rules the 11th House? (modern)", options: ["Neptune", "Saturn", "Uranus", "Venus"], correct: 2 },
  { question: "What planet rules the 12th House? (modern)", options: ["Pluto", "Saturn", "Neptune", "Moon"], correct: 2 },
];

export default function HouseStoryViewer({ houses, personName, lifePath, birthDate, deathDate, zodiac }) {
  const [currentHouse, setCurrentHouse] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [score, setScore] = useState(0);
  const [answeredHouses, setAnsweredHouses] = useState([]);
  
  const house = houses[currentHouse];
  const quiz = HOUSE_QUIZ[currentHouse];
  const Icon = house.icon;

  const handleAnswer = (index) => {
    if (quizResult) return;
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
          <Link to={createPageUrl('HouseHunt')}>
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" /> All Stories
            </Button>
          </Link>
        </div>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">The 12 Houses of {personName}</h1>
          <p className="text-gray-300 text-sm">A life story told through the astrological houses</p>
          <p className="text-amber-400 text-xs mt-1">
            Life Path {lifePath} • {zodiac && `${zodiac} • `}Born {birthDate}
            {deathDate && ` • Died ${deathDate}`}
          </p>
          {score > 0 && (
            <p className="text-green-400 text-sm mt-2">🏆 Quiz Score: {score}/12</p>
          )}
        </div>

        {/* House Navigation Dots */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {houses.map((h, i) => (
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
            <h3 className="text-xl font-bold text-white mb-4">"{house.storyTitle}"</h3>
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