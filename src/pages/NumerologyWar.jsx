import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { Sparkles, RotateCcw, Swords, Trophy, BookOpen, Loader2, Gamepad2, ArrowLeft, Flame, Zap, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';

// Sound manager
class SoundManager {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  playCannon() {
    if (!this.enabled) return;
    this.init();
    try {
      const ctx = this.audioContext;
      const now = ctx.currentTime;

      // Deep boom
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(20, now + 0.4);
      oscGain.gain.setValueAtTime(0.8, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);

      // Explosion noise
      const bufferSize = ctx.sampleRate * 0.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.5);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.6, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.5);
    } catch (e) {}
  }

  playFlip() {
    if (!this.enabled) return;
    this.init();
    try {
      const ctx = this.audioContext;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {}
  }

  playWin() {
    if (!this.enabled) return;
    this.init();
    try {
      const ctx = this.audioContext;
      const now = ctx.currentTime;
      [523, 659, 784].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.2);
      });
    } catch (e) {}
  }

  playLose() {
    if (!this.enabled) return;
    this.init();
    try {
      const ctx = this.audioContext;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }
}

const soundManager = new SoundManager();

const getWarValue = (card) => {
  let num = card.reduced_value || card.raw_value || 5;
  if (num === 11 || num === 22 || num === 33) return num;
  while (num > 9) {
    num = String(num).split('').reduce((a, b) => a + parseInt(b), 0);
    if (num === 11 || num === 22 || num === 33) return num;
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
  const [gameState, setGameState] = useState('ready');
  const [roundResult, setRoundResult] = useState(null);
  const [showLearning, setShowLearning] = useState(false);
  const [highlightCategory, setHighlightCategory] = useState('all');
  const [accessDenied, setAccessDenied] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [roundsWon, setRoundsWon] = useState(0);
  const [roundsLost, setRoundsLost] = useState(0);
  const [warCount, setWarCount] = useState(0);
  const [showExplosion, setShowExplosion] = useState(false);
  const [cardFlipping, setCardFlipping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    soundManager.enabled = soundEnabled;
  }, [soundEnabled]);

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
    soundManager.init();
    const shuffled = shuffleDeck(allCards);
    const half = Math.floor(shuffled.length / 2);
    setPlayerDeck(shuffled.slice(0, half));
    setCpuDeck(shuffled.slice(half));
    setPlayerCard(null);
    setCpuCard(null);
    setWarPile([]);
    setGameState('ready');
    setRoundResult(null);
    setStreak(0);
    setMaxStreak(0);
    setRoundsWon(0);
    setRoundsLost(0);
    setWarCount(0);
  };

  const flipCards = () => {
    if (playerDeck.length === 0 || cpuDeck.length === 0) {
      endGame();
      return;
    }

    setCardFlipping(true);
    soundManager.playFlip();

    setTimeout(() => {
      const pCard = playerDeck[0];
      const cCard = cpuDeck[0];
      
      setPlayerCard(pCard);
      setCpuCard(cCard);
      setPlayerDeck(playerDeck.slice(1));
      setCpuDeck(cpuDeck.slice(1));
      setGameState('flipped');
      setCardFlipping(false);

      const pVal = getWarValue(pCard);
      const cVal = getWarValue(cCard);

      if (pVal > cVal) {
        setRoundResult('win');
        soundManager.playWin();
        setStreak(s => {
          const newStreak = s + 1;
          if (newStreak > maxStreak) setMaxStreak(newStreak);
          return newStreak;
        });
        setRoundsWon(r => r + 1);
      } else if (cVal > pVal) {
        setRoundResult('lose');
        soundManager.playLose();
        setStreak(0);
        setRoundsLost(r => r + 1);
      } else {
        setRoundResult('war');
        setWarCount(w => w + 1);
        setShowExplosion(true);
        soundManager.playCannon();
        setTimeout(() => setShowExplosion(false), 1000);
      }
    }, 300);
  };

  const collectCards = () => {
    if (roundResult === 'war') {
      setWarPile([...warPile, playerCard, cpuCard]);
      setGameState('war');
      setRoundResult(null);
      setPlayerCard(null);
      setCpuCard(null);
    } else if (roundResult === 'win') {
      const wonCards = [playerCard, cpuCard, ...warPile];
      setPlayerDeck([...playerDeck, ...shuffleDeck(wonCards)]);
      resetRound();
    } else {
      const wonCards = [playerCard, cpuCard, ...warPile];
      setCpuDeck([...cpuDeck, ...shuffleDeck(wonCards)]);
      resetRound();
    }
  };

  const executeWar = () => {
    const pFaceDown = playerDeck.slice(0, 3);
    const cFaceDown = cpuDeck.slice(0, 3);
    
    if (playerDeck.length < 4) {
      setGameState('ended');
      return;
    }
    if (cpuDeck.length < 4) {
      setGameState('ended');
      return;
    }

    soundManager.playCannon();
    setShowExplosion(true);
    setTimeout(() => setShowExplosion(false), 1000);

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
      soundManager.playWin();
      setStreak(s => {
        const newStreak = s + 1;
        if (newStreak > maxStreak) setMaxStreak(newStreak);
        return newStreak;
      });
      setRoundsWon(r => r + 1);
    } else if (cVal > pVal) {
      setRoundResult('lose');
      soundManager.playLose();
      setStreak(0);
      setRoundsLost(r => r + 1);
    } else {
      setRoundResult('war');
      setWarCount(w => w + 1);
      soundManager.playCannon();
    }
  };

  const resetRound = () => {
    setPlayerCard(null);
    setCpuCard(null);
    setWarPile([]);
    setGameState('ready');
    setRoundResult(null);

    if (playerDeck.length === 0 || cpuDeck.length === 0) {
      setGameState('ended');
    }
  };

  const endGame = () => setGameState('ended');
  const getWinner = () => {
    if (playerDeck.length > cpuDeck.length) return 'player';
    if (cpuDeck.length > playerDeck.length) return 'cpu';
    return 'tie';
  };

  const renderCard = (card, faceDown = false, isPlayer = false) => {
    if (!card) return null;
    
    const warVal = getWarValue(card);
    const isMaster = warVal === 11 || warVal === 22 || warVal === 33;
    
    return (
      <motion.div
        initial={{ rotateY: 180, scale: 0.8 }}
        animate={{ rotateY: 0, scale: 1 }}
        transition={{ duration: 0.4, type: "spring" }}
        whileHover={{ scale: 1.05 }}
        className={`relative w-32 h-44 rounded-xl shadow-2xl ${
          faceDown 
            ? 'bg-gradient-to-br from-purple-800 to-indigo-900' 
            : isMaster 
              ? 'bg-gradient-to-br from-purple-400 via-pink-400 to-amber-300 ring-4 ring-amber-400 animate-pulse'
              : 'bg-gradient-to-br from-amber-100 to-amber-50'
        }`}
      >
        {faceDown ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
              <Sparkles className="w-10 h-10 text-amber-400" />
            </motion.div>
          </div>
        ) : (
          <div className="absolute inset-0 p-2 flex flex-col">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className={`text-3xl font-bold text-center ${isMaster ? 'text-white' : 'text-purple-900'}`}
            >
              {warVal}
              {isMaster && <Zap className="w-4 h-4 inline ml-1 text-yellow-300" />}
            </motion.div>
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
      </motion.div>
    );
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
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-rose-900 to-red-950 p-6 relative overflow-hidden">
      {/* Explosion Effect */}
      <AnimatePresence>
        {showExplosion && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="text-9xl"
              >
                💥
              </motion.div>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-black text-white drop-shadow-lg"
              >
                WAR!
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Link to={createPageUrl('Games')}>
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-gray-300 hover:text-white"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </div>

        {/* Title */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-bold text-amber-400 mb-2 flex items-center justify-center gap-3">
            <Swords className="w-10 h-10" />
            Numerology War
            <Swords className="w-10 h-10" />
          </h1>
          <p className="text-red-200">Higher number wins! Master numbers are powerful!</p>
        </motion.div>

        {/* Stats Bar */}
        {gameState !== 'ended' && (playerDeck.length > 0 || cpuDeck.length > 0) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-5 gap-2 mb-6 text-center"
          >
            <div className="bg-amber-500/20 rounded-lg p-2">
              <p className="text-amber-300 font-bold text-xl">{playerDeck.length}</p>
              <p className="text-xs text-gray-400">Your Cards</p>
            </div>
            <div className="bg-green-500/20 rounded-lg p-2">
              <p className="text-green-300 font-bold text-xl">{roundsWon}</p>
              <p className="text-xs text-gray-400">Wins</p>
            </div>
            <div className="bg-purple-500/20 rounded-lg p-2">
              <p className="text-purple-300 font-bold text-xl flex items-center justify-center gap-1">
                {streak > 2 && <Flame className="w-4 h-4 text-orange-400" />}
                {streak}
              </p>
              <p className="text-xs text-gray-400">Streak</p>
            </div>
            <div className="bg-red-500/20 rounded-lg p-2">
              <p className="text-red-300 font-bold text-xl">{roundsLost}</p>
              <p className="text-xs text-gray-400">Losses</p>
            </div>
            <div className="bg-red-500/20 rounded-lg p-2">
              <p className="text-red-300 font-bold text-xl">{cpuDeck.length}</p>
              <p className="text-xs text-gray-400">CPU Cards</p>
            </div>
          </motion.div>
        )}

        {/* War Pile */}
        {warPile.length > 0 && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center mb-4"
          >
            <div className="inline-flex items-center gap-2 bg-purple-600/30 px-4 py-2 rounded-full border border-purple-500">
              <Swords className="w-5 h-5 text-purple-300" />
              <span className="text-purple-300 font-bold">{warPile.length} cards at stake!</span>
              <Swords className="w-5 h-5 text-purple-300" />
            </div>
          </motion.div>
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
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Trophy className={`w-20 h-20 mx-auto mb-4 ${getWinner() === 'player' ? 'text-amber-400' : 'text-red-400'}`} />
                  <h2 className="text-3xl text-white mb-4">
                    {getWinner() === 'player' ? '🎉 Victory!' : getWinner() === 'cpu' ? 'Defeat!' : "It's a Tie!"}
                  </h2>
                  <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-6">
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-green-400 font-bold text-xl">{roundsWon}</p>
                      <p className="text-xs text-gray-400">Wins</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-red-400 font-bold text-xl">{roundsLost}</p>
                      <p className="text-xs text-gray-400">Losses</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-purple-400 font-bold text-xl">{warCount}</p>
                      <p className="text-xs text-gray-400">Wars</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-amber-400 font-bold text-xl">{maxStreak}</p>
                      <p className="text-xs text-gray-400">Best Streak</p>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button onClick={startGame} className="bg-amber-600 hover:bg-amber-700">
                      <RotateCcw className="w-4 h-4 mr-2" /> Play Again
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <>
                  <Swords className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                  <h2 className="text-2xl text-white mb-4">Ready for War?</h2>
                  <p className="text-red-200 mb-2">{allCards.length} cards in the deck</p>
                  <p className="text-purple-300 mb-6 text-sm">Master numbers 11, 22, 33 keep their power!</p>
                  <Button 
                    onClick={startGame} 
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-xl px-12"
                  >
                    <Swords className="w-5 h-5 mr-2" /> Start War!
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
                <p className="text-amber-300 font-bold mb-2 flex items-center justify-center gap-2">
                  You
                  {streak > 2 && <Flame className="w-4 h-4 text-orange-400 animate-pulse" />}
                </p>
                <AnimatePresence mode="wait">
                  {playerCard ? (
                    <motion.div key="card">{renderCard(playerCard, false, true)}</motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      animate={cardFlipping ? { rotateY: [0, 90] } : {}}
                      className="w-32 h-44 rounded-xl border-2 border-dashed border-amber-500/50 flex items-center justify-center bg-amber-500/10"
                    >
                      <span className="text-amber-500/50 text-4xl">?</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* VS */}
              <div className="text-center">
                <motion.div
                  animate={roundResult === 'war' ? { rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Swords className="w-12 h-12 text-red-400" />
                </motion.div>
                <AnimatePresence>
                  {roundResult && (
                    <motion.p
                      initial={{ scale: 0, y: 10 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0 }}
                      className={`font-bold mt-2 text-xl ${
                        roundResult === 'win' ? 'text-green-400' : 
                        roundResult === 'lose' ? 'text-red-400' : 
                        'text-purple-400'
                      }`}
                    >
                      {roundResult === 'win' ? '🏆 WIN!' : roundResult === 'lose' ? '💀 LOSE' : '⚔️ WAR!'}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* CPU Card */}
              <div className="text-center">
                <p className="text-red-300 font-bold mb-2">CPU</p>
                <AnimatePresence mode="wait">
                  {cpuCard ? (
                    <motion.div key="card">{renderCard(cpuCard)}</motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      animate={cardFlipping ? { rotateY: [0, 90] } : {}}
                      className="w-32 h-44 rounded-xl border-2 border-dashed border-red-500/50 flex items-center justify-center bg-red-500/10"
                    >
                      <span className="text-red-500/50 text-4xl">?</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              {gameState === 'ready' && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={flipCards}
                    size="lg"
                    className="bg-amber-600 hover:bg-amber-700 text-lg px-8"
                    disabled={playerDeck.length === 0}
                  >
                    <Swords className="w-5 h-5 mr-2" /> Flip Cards!
                  </Button>
                </motion.div>
              )}
              
              {(gameState === 'flipped' || gameState === 'warFlipped') && roundResult !== 'war' && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={collectCards}
                    size="lg"
                    className={`text-lg px-8 ${roundResult === 'win' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                  >
                    {roundResult === 'win' ? '🎉 Collect Cards!' : 'Continue...'}
                  </Button>
                </motion.div>
              )}

              {(gameState === 'flipped' || gameState === 'warFlipped') && roundResult === 'war' && (
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <Button 
                    onClick={collectCards}
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700 text-lg px-8"
                  >
                    ⚔️ Go to War! ⚔️
                  </Button>
                </motion.div>
              )}

              {gameState === 'war' && (
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                >
                  <Button 
                    onClick={executeWar}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8"
                  >
                    💥 Draw War Cards! 💥
                  </Button>
                </motion.div>
              )}

              <Button 
                onClick={() => setShowLearning(true)}
                variant="outline"
                className="border-purple-500 text-purple-300 hover:bg-purple-500/20"
              >
                <BookOpen className="w-4 h-4 mr-2" /> Cards
              </Button>
            </div>
          </>
        )}

        {/* Learning Modal */}
        <Dialog open={showLearning} onOpenChange={setShowLearning}>
          <DialogContent className="bg-slate-900 border-purple-500 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-amber-400 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Card Reference
              </DialogTitle>
            </DialogHeader>
            <div className="mb-4">
              <div className="flex gap-2 flex-wrap">
                {['all', 'biblical', 'historical', 'sports', 'rock'].map(cat => (
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
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {allCards
                .filter(c => highlightCategory === 'all' || c.category === highlightCategory)
                .sort((a, b) => getWarValue(b) - getWarValue(a))
                .map((card, i) => {
                  const warVal = getWarValue(card);
                  const isMaster = warVal === 11 || warVal === 22 || warVal === 33;
                  return (
                    <div key={i} className={`p-3 rounded-lg flex items-center justify-between ${isMaster ? 'bg-purple-500/20 border border-purple-500' : 'bg-white/10'}`}>
                      <div>
                        <span className="font-bold text-amber-300">{card.name}</span>
                        <span className="text-gray-400 text-sm ml-2 capitalize">({card.category})</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${isMaster ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                        {warVal}{isMaster ? ' ⚡' : ''}
                      </span>
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