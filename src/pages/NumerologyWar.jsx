import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { Sparkles, RotateCcw, Swords, Trophy, BookOpen, Loader2, Gamepad2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Cannon sound effect for war
const playCannonSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create noise for explosion
    const bufferSize = audioContext.sampleRate * 0.3;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }
    
    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;
    
    // Low frequency oscillator for boom
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(30, audioContext.currentTime + 0.2);
    
    // Gain controls
    const noiseGain = audioContext.createGain();
    noiseGain.gain.setValueAtTime(0.8, audioContext.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    const oscGain = audioContext.createGain();
    oscGain.gain.setValueAtTime(0.6, audioContext.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    // Connect
    noise.connect(noiseGain);
    oscillator.connect(oscGain);
    noiseGain.connect(audioContext.destination);
    oscGain.connect(audioContext.destination);
    
    // Play
    noise.start();
    oscillator.start();
    noise.stop(audioContext.currentTime + 0.3);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (e) {
    // Audio not supported, ignore
  }
};

// For War game: reduce to single digit BUT preserve master numbers 11, 22, 33
const getWarValue = (card) => {
  let num = card.reduced_value || card.raw_value || 5;
  
  // Check if it's a master number BEFORE any reduction
  if (num === 11 || num === 22 || num === 33) {
    return num; // Masters stay as-is
  }
  
  // Reduce to single digit
  while (num > 9) {
    num = String(num).split('').reduce((a, b) => a + parseInt(b), 0);
    // Check again after reduction in case we hit a master
    if (num === 11 || num === 22 || num === 33) {
      return num;
    }
  }
  return num;
};

export default function NumerologyWar() {
  const [allCards, setAllCards] = useState([]);
  const [playerDeck, setPlayerDeck] = useState([]);
  const [cpuDeck, setCpuDeck] = useState([]);
  const [playerCard, setPlayerCard] = useState(null);
  const [cpuCard, setCpuCard] = useState(null);
  const [warPile, setWarPile] = useState([]);
  const [gameState, setGameState] = useState('ready'); // ready, flipped, war, warFlipped, ended
  const [roundResult, setRoundResult] = useState(null);
  const [showLearning, setShowLearning] = useState(false);
  const [highlightCategory, setHighlightCategory] = useState('all');
  const [accessDenied, setAccessDenied] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [gameHistory, setGameHistory] = useState([]);

  useEffect(() => {
    checkAccessAndLoadCards();
  }, []);

  const checkAccessAndLoadCards = async () => {
    const user = await base44.auth.me();
    let members = await base44.entities.FamilyMember.filter({ email: user.email });
    let selfMember = members.find(m => m.relationship === 'self') || members[0];
    
    if (!selfMember) {
      const createdMembers = await base44.entities.FamilyMember.filter({ created_by: user.email });
      selfMember = createdMembers[0];
    }
    
    if (selfMember?.family_id) {
      const allFamilies = await base44.entities.Family.list();
      const family = allFamilies.find(f => f.id === selfMember.family_id);
      if (family && family.enable_blackjack === false) {
        setAccessDenied(true);
        setCheckingAccess(false);
        return;
      }
    }
    
    const cards = await base44.entities.NumerologyCard.list();
    setAllCards(cards);
    setCheckingAccess(false);
  };

  const shuffleDeck = (cards) => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startGame = () => {
    // Always use ALL cards to ensure full deck
    const shuffled = shuffleDeck(allCards);
    const half = Math.floor(shuffled.length / 2);
    
    setPlayerDeck(shuffled.slice(0, half));
    setCpuDeck(shuffled.slice(half));
    setPlayerCard(null);
    setCpuCard(null);
    setWarPile([]);
    setGameState('ready');
    setRoundResult(null);
    setGameHistory([]);
  };

  const flipCards = () => {
    if (playerDeck.length === 0 || cpuDeck.length === 0) {
      endGame();
      return;
    }

    const pCard = playerDeck[0];
    const cCard = cpuDeck[0];
    
    setPlayerCard(pCard);
    setCpuCard(cCard);
    setPlayerDeck(playerDeck.slice(1));
    setCpuDeck(cpuDeck.slice(1));
    setGameState('flipped');

    const pVal = getWarValue(pCard);
    const cVal = getWarValue(cCard);

    if (pVal > cVal) {
      setRoundResult('win');
    } else if (cVal > pVal) {
      setRoundResult('lose');
    } else {
      setRoundResult('war');
      playCannonSound();
    }
  };

  const collectCards = () => {
    if (roundResult === 'war') {
      // Start war - add current cards to pile
      setWarPile([...warPile, playerCard, cpuCard]);
      setGameState('war');
      setRoundResult(null);
      setPlayerCard(null);
      setCpuCard(null);
    } else if (roundResult === 'win') {
      // Player wins - collect all cards
      const wonCards = [playerCard, cpuCard, ...warPile];
      setPlayerDeck([...playerDeck, ...shuffleDeck(wonCards)]);
      setGameHistory([...gameHistory, { winner: 'player', cards: wonCards }]);
      resetRound();
    } else {
      // CPU wins
      const wonCards = [playerCard, cpuCard, ...warPile];
      setCpuDeck([...cpuDeck, ...shuffleDeck(wonCards)]);
      setGameHistory([...gameHistory, { winner: 'cpu', cards: wonCards }]);
      resetRound();
    }
  };

  const executeWar = () => {
    // Each player puts 3 cards face down, then 1 face up
    const pFaceDown = playerDeck.slice(0, 3);
    const cFaceDown = cpuDeck.slice(0, 3);
    
    if (playerDeck.length < 4) {
      // Not enough cards, player loses
      setGameState('ended');
      return;
    }
    if (cpuDeck.length < 4) {
      // CPU doesn't have enough, player wins
      setGameState('ended');
      return;
    }

    const pWarCard = playerDeck[3];
    const cWarCard = cpuDeck[3];

    setWarPile([...warPile, ...pFaceDown, ...cFaceDown]);
    setPlayerDeck(playerDeck.slice(4));
    setCpuDeck(cpuDeck.slice(4));
    setPlayerCard(pWarCard);
    setCpuCard(cWarCard);
    setGameState('warFlipped');

    const pVal = getWarValue(pWarCard);
    const cVal = getWarValue(cWarCard);

    if (pVal > cVal) {
      setRoundResult('win');
    } else if (cVal > pVal) {
      setRoundResult('lose');
    } else {
      setRoundResult('war'); // Double war!
      playCannonSound();
    }
  };

  const resetRound = () => {
    setPlayerCard(null);
    setCpuCard(null);
    setWarPile([]);
    setGameState('ready');
    setRoundResult(null);

    // Check for game end
    if (playerDeck.length === 0 || cpuDeck.length === 0) {
      setGameState('ended');
    }
  };

  const endGame = () => {
    setGameState('ended');
  };

  const renderCard = (card, faceDown = false) => {
    if (!card) return null;
    
    const warVal = getWarValue(card);
    const isMaster = warVal === 11 || warVal === 22 || warVal === 33;
    const isHighlighted = highlightCategory === 'all' || card.category === highlightCategory;
    
    return (
      <div className={`relative w-32 h-44 rounded-xl shadow-lg transition-all transform hover:scale-105 ${
        faceDown 
          ? 'bg-gradient-to-br from-purple-800 to-indigo-900' 
          : isMaster 
            ? 'bg-gradient-to-br from-purple-400 via-pink-400 to-amber-300 ring-4 ring-amber-400'
            : 'bg-gradient-to-br from-amber-100 to-amber-50'
      } ${!isHighlighted && !faceDown ? 'opacity-60' : ''}`}>
        {faceDown ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-amber-400" />
          </div>
        ) : (
          <div className="absolute inset-0 p-2 flex flex-col">
            <div className={`text-3xl font-bold text-center ${isMaster ? 'text-white' : 'text-purple-900'}`}>
              {warVal}
              {isMaster && <span className="text-xs ml-1">✨</span>}
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className={`text-sm text-center font-semibold px-1 leading-tight ${isMaster ? 'text-white' : 'text-purple-800'}`}>
                {card.name}
              </p>
            </div>
            <div className={`text-xs text-center capitalize ${isMaster ? 'text-purple-100' : 'text-purple-600'}`}>
              {card.category}
            </div>
          </div>
        )}
      </div>
    );
  };

  const getWinner = () => {
    if (playerDeck.length > cpuDeck.length) return 'player';
    if (cpuDeck.length > playerDeck.length) return 'cpu';
    return 'tie';
  };

  if (checkingAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-rose-900 to-red-950 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-rose-900 to-red-950 p-6 flex items-center justify-center">
        <Card className="bg-black/30 border-red-700 max-w-md">
          <CardContent className="py-12 text-center">
            <Gamepad2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">War Disabled</h2>
            <p className="text-red-200">This game has been disabled by your family admin.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-rose-900 to-red-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link to={createPageUrl('Games')}>
          <Button variant="ghost" className="text-gray-300 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Games
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-amber-400 mb-2 flex items-center justify-center gap-3">
            <Swords className="w-10 h-10" />
            Numerology War
            <Swords className="w-10 h-10" />
          </h1>
          <p className="text-red-200">Higher number wins! Master numbers (11, 22, 33) are powerful!</p>
        </div>

        {/* Deck Counts */}
        {gameState !== 'ended' && (playerDeck.length > 0 || cpuDeck.length > 0) && (
          <div className="flex justify-between mb-6 px-4">
            <div className="text-center">
              <p className="text-amber-300 font-bold text-2xl">{playerDeck.length}</p>
              <p className="text-red-200 text-sm">Your Cards</p>
            </div>
            {warPile.length > 0 && (
              <div className="text-center">
                <p className="text-purple-300 font-bold text-2xl">{warPile.length}</p>
                <p className="text-red-200 text-sm">War Pile</p>
              </div>
            )}
            <div className="text-center">
              <p className="text-red-300 font-bold text-2xl">{cpuDeck.length}</p>
              <p className="text-red-200 text-sm">CPU Cards</p>
            </div>
          </div>
        )}

        {/* Game Area */}
        {gameState === 'ended' || (playerDeck.length === 0 && cpuDeck.length === 0 && !playerCard) ? (
          <Card className="bg-black/30 border-red-700">
            <CardContent className="py-12 text-center">
              {allCards.length === 0 ? (
                <>
                  <Loader2 className="w-16 h-16 text-amber-400 mx-auto mb-4 animate-spin" />
                  <p className="text-red-200">Loading cards...</p>
                </>
              ) : gameState === 'ended' ? (
                <>
                  <Trophy className={`w-20 h-20 mx-auto mb-4 ${getWinner() === 'player' ? 'text-amber-400' : 'text-red-400'}`} />
                  <h2 className="text-3xl text-white mb-4">
                    {getWinner() === 'player' ? '🎉 You Won!' : getWinner() === 'cpu' ? 'CPU Wins!' : "It's a Tie!"}
                  </h2>
                  <p className="text-red-200 mb-6">
                    Final: You {playerDeck.length} - CPU {cpuDeck.length}
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button onClick={startGame} className="bg-amber-600 hover:bg-amber-700">
                      <RotateCcw className="w-4 h-4 mr-2" /> Play Again
                    </Button>
                    <Button onClick={() => setShowLearning(true)} variant="outline" className="border-purple-500 text-purple-300">
                      <BookOpen className="w-4 h-4 mr-2" /> Review Cards
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Swords className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                  <h2 className="text-2xl text-white mb-4">Ready for War?</h2>
                  <p className="text-red-200 mb-2">{allCards.length} cards in the deck</p>
                  <p className="text-purple-300 mb-6 text-sm">Master numbers 11, 22, 33 keep their power!</p>
                  
                  {/* Category filter for research */}
                  <div className="mb-6">
                    <p className="text-red-200 text-sm mb-2">Highlight category during play:</p>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {['all', 'biblical', 'historical', 'sports', 'rock', 'superhero', 'family'].map(cat => (
                        <Button
                          key={cat}
                          variant={highlightCategory === cat ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setHighlightCategory(cat)}
                          className={highlightCategory === cat 
                            ? 'bg-purple-600 hover:bg-purple-700' 
                            : 'border-red-500 text-red-300 hover:bg-red-800'
                          }
                        >
                          {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={startGame} 
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-xl px-12"
                  >
                    Start War!
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Battle Arena */}
            <div className="flex justify-center items-center gap-8 mb-8">
              {/* Player Card */}
              <div className="text-center">
                <p className="text-amber-300 font-bold mb-2">You</p>
                {playerCard ? renderCard(playerCard) : (
                  <div className="w-32 h-44 rounded-xl border-2 border-dashed border-amber-500/50 flex items-center justify-center">
                    <span className="text-amber-500/50">?</span>
                  </div>
                )}
              </div>

              {/* VS */}
              <div className="text-center">
                <Swords className="w-12 h-12 text-red-400" />
                {roundResult && (
                  <p className={`font-bold mt-2 ${
                    roundResult === 'win' ? 'text-green-400' : 
                    roundResult === 'lose' ? 'text-red-400' : 
                    'text-purple-400'
                  }`}>
                    {roundResult === 'win' ? 'WIN!' : roundResult === 'lose' ? 'LOSE' : '⚔️ WAR! ⚔️'}
                  </p>
                )}
              </div>

              {/* CPU Card */}
              <div className="text-center">
                <p className="text-red-300 font-bold mb-2">CPU</p>
                {cpuCard ? renderCard(cpuCard) : (
                  <div className="w-32 h-44 rounded-xl border-2 border-dashed border-red-500/50 flex items-center justify-center">
                    <span className="text-red-500/50">?</span>
                  </div>
                )}
              </div>
            </div>

            {/* War Pile Indicator */}
            {warPile.length > 0 && (
              <div className="text-center mb-4">
                <p className="text-purple-300">⚔️ {warPile.length} cards in the war pile! ⚔️</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              {gameState === 'ready' && (
                <Button 
                  onClick={flipCards}
                  size="lg"
                  className="bg-amber-600 hover:bg-amber-700"
                  disabled={playerDeck.length === 0}
                >
                  <Swords className="w-5 h-5 mr-2" /> Flip Cards!
                </Button>
              )}
              
              {(gameState === 'flipped' || gameState === 'warFlipped') && roundResult !== 'war' && (
                <Button 
                  onClick={collectCards}
                  size="lg"
                  className={roundResult === 'win' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                >
                  {roundResult === 'win' ? 'Collect Cards!' : 'Continue...'}
                </Button>
              )}

              {(gameState === 'flipped' || gameState === 'warFlipped') && roundResult === 'war' && (
                <Button 
                  onClick={collectCards}
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  ⚔️ Go to War! ⚔️
                </Button>
              )}

              {gameState === 'war' && (
                <Button 
                  onClick={executeWar}
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 animate-pulse"
                >
                  ⚔️ Draw War Cards! ⚔️
                </Button>
              )}

              <Button 
                onClick={() => setShowLearning(true)}
                variant="outline"
                className="border-purple-500 text-purple-300"
              >
                <BookOpen className="w-4 h-4 mr-2" /> Learn
              </Button>
            </div>
          </>
        )}

        {/* Learning Modal */}
        <Dialog open={showLearning} onOpenChange={setShowLearning}>
          <DialogContent className="bg-slate-900 border-purple-500 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-amber-400 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Card Research
              </DialogTitle>
            </DialogHeader>
            <div className="mb-4">
              <p className="text-gray-400 text-sm mb-2">Filter by category:</p>
              <div className="flex gap-2 flex-wrap">
                {['all', 'biblical', 'historical', 'sports', 'rock', 'superhero', 'family'].map(cat => (
                  <Button
                    key={cat}
                    variant={highlightCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setHighlightCategory(cat)}
                    className={highlightCategory === cat ? 'bg-purple-600' : 'border-gray-600'}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {allCards
                .filter(c => highlightCategory === 'all' || c.category === highlightCategory)
                .sort((a, b) => getWarValue(b) - getWarValue(a))
                .map((card, i) => {
                  const warVal = getWarValue(card);
                  const isMaster = warVal === 11 || warVal === 22 || warVal === 33;
                  return (
                    <div key={i} className={`p-3 rounded-lg ${isMaster ? 'bg-purple-500/20 border border-purple-500' : 'bg-white/10'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-amber-300">{card.name}</h3>
                        <div className="flex gap-2">
                          <span className={`px-2 py-0.5 rounded text-sm ${isMaster ? 'bg-purple-600' : 'bg-gray-600'}`}>
                            War Value: {warVal}{isMaster ? ' ✨' : ''}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs capitalize">{card.category}</p>
                      {card.short_bio && <p className="text-gray-300 text-sm mt-1">{card.short_bio}</p>}
                    </div>
                  );
                })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}