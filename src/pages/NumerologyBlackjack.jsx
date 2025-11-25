import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { Sparkles, RotateCcw, Plus, Hand, Trophy, Skull, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const PYTHAGOREAN = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
};

const calculateValue = (name) => {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, '');
  let total = 0;
  for (const char of letters) {
    total += PYTHAGOREAN[char] || 0;
  }
  return total;
};

const reduceNumber = (num) => {
  if ([11, 22, 33].includes(num)) return num;
  while (num > 9 && ![11, 22, 33].includes(num)) {
    num = String(num).split('').reduce((a, b) => a + parseInt(b), 0);
  }
  return num;
};

export default function NumerologyBlackjack() {
  const [allCards, setAllCards] = useState([]);
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameState, setGameState] = useState('betting'); // betting, playing, dealerTurn, ended
  const [result, setResult] = useState(null);
  const [showLearning, setShowLearning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stats, setStats] = useState({ wins: 0, losses: 0, pushes: 0 });

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    const cards = await base44.entities.NumerologyCard.list();
    setAllCards(cards);
  };

  const getPlayerTotal = () => playerHand.reduce((sum, card) => sum + card.raw_value, 0);
  const getDealerTotal = () => dealerHand.reduce((sum, card) => sum + card.raw_value, 0);

  const shuffleDeck = (cards) => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startGame = () => {
    let cardsToUse = allCards;
    if (selectedCategory !== 'all') {
      cardsToUse = allCards.filter(c => c.category === selectedCategory);
    }
    
    if (cardsToUse.length < 10) {
      alert('Not enough cards in this category. Need at least 10.');
      return;
    }

    const shuffled = shuffleDeck(cardsToUse);
    const newDeck = [...shuffled];
    
    // Deal 2 to player, 2 to dealer
    const pHand = [newDeck.pop(), newDeck.pop()];
    const dHand = [newDeck.pop(), newDeck.pop()];
    
    setDeck(newDeck);
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setGameState('playing');
    setResult(null);
  };

  const hit = () => {
    if (deck.length === 0) return;
    
    const newCard = deck.pop();
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    setDeck([...deck]);

    const total = newHand.reduce((sum, card) => sum + card.raw_value, 0);
    if (total > 21) {
      endGame('bust');
    }
  };

  const stand = () => {
    setGameState('dealerTurn');
    dealerPlay();
  };

  const dealerPlay = () => {
    let dHand = [...dealerHand];
    let currentDeck = [...deck];
    
    // Dealer hits until 17 or higher
    while (dHand.reduce((sum, card) => sum + card.raw_value, 0) < 17 && currentDeck.length > 0) {
      dHand.push(currentDeck.pop());
    }
    
    setDealerHand(dHand);
    setDeck(currentDeck);
    
    const dealerTotal = dHand.reduce((sum, card) => sum + card.raw_value, 0);
    const playerTotal = playerHand.reduce((sum, card) => sum + card.raw_value, 0);

    if (dealerTotal > 21) {
      endGame('dealerBust');
    } else if (dealerTotal > playerTotal) {
      endGame('lose');
    } else if (playerTotal > dealerTotal) {
      endGame('win');
    } else {
      endGame('push');
    }
  };

  const endGame = (res) => {
    setResult(res);
    setGameState('ended');
    
    if (res === 'win' || res === 'dealerBust') {
      setStats(s => ({ ...s, wins: s.wins + 1 }));
    } else if (res === 'lose' || res === 'bust') {
      setStats(s => ({ ...s, losses: s.losses + 1 }));
    } else {
      setStats(s => ({ ...s, pushes: s.pushes + 1 }));
    }
  };

  const renderCard = (card, faceDown = false) => (
    <div className={`relative w-24 h-36 rounded-xl shadow-lg transition-all transform hover:scale-105 ${
      faceDown 
        ? 'bg-gradient-to-br from-purple-800 to-indigo-900' 
        : 'bg-gradient-to-br from-amber-100 to-amber-50'
    }`}>
      {faceDown ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-amber-400" />
        </div>
      ) : (
        <div className="absolute inset-0 p-2 flex flex-col">
          <div className="text-2xl font-bold text-purple-900 text-center">{card.raw_value}</div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-center text-purple-800 font-semibold px-1 leading-tight">
              {card.name}
            </p>
          </div>
          <div className="text-[10px] text-center text-purple-500">vibe: {card.reduced_value}</div>
          <div className="text-xs text-center text-purple-600 capitalize">{card.category}</div>
        </div>
      )}
    </div>
  );

  const getResultMessage = () => {
    switch (result) {
      case 'win': return { text: 'You Win!', icon: Trophy, color: 'text-green-400' };
      case 'dealerBust': return { text: 'Dealer Busts! You Win!', icon: Trophy, color: 'text-green-400' };
      case 'lose': return { text: 'Dealer Wins', icon: Skull, color: 'text-red-400' };
      case 'bust': return { text: 'Bust! Over 21', icon: Skull, color: 'text-red-400' };
      case 'push': return { text: 'Push - Tie Game', icon: Hand, color: 'text-yellow-400' };
      default: return null;
    }
  };

  const resultInfo = getResultMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-green-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-amber-400 mb-2">Numerology Blackjack</h1>
          <p className="text-green-200">Hit 21 with the power of names</p>
          <div className="flex justify-center gap-4 mt-2 text-sm">
            <span className="text-green-400">Wins: {stats.wins}</span>
            <span className="text-red-400">Losses: {stats.losses}</span>
            <span className="text-yellow-400">Pushes: {stats.pushes}</span>
          </div>
        </div>

        {/* Game Area */}
        {gameState === 'betting' ? (
          <Card className="bg-black/30 border-green-700">
            <CardContent className="py-12 text-center">
              <Sparkles className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h2 className="text-2xl text-white mb-6">Choose Your Deck</h2>
              
              <div className="flex justify-center gap-3 mb-8 flex-wrap">
                {['all', 'biblical', 'historical', 'family'].map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(cat)}
                    className={selectedCategory === cat 
                      ? 'bg-amber-600 hover:bg-amber-700' 
                      : 'border-green-500 text-green-300 hover:bg-green-800'
                    }
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Button>
                ))}
              </div>

              <Button 
                onClick={startGame} 
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-xl px-12"
                disabled={allCards.length < 10}
              >
                Deal Cards
              </Button>

              {allCards.length < 10 && (
                <p className="text-red-400 mt-4">Loading cards... Need at least 10 to play.</p>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Dealer's Hand */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-green-300 font-semibold">Dealer</span>
                {gameState !== 'playing' && (
                  <span className="text-white font-bold">({getDealerTotal()})</span>
                )}
              </div>
              <div className="flex gap-3 flex-wrap">
                {dealerHand.map((card, i) => (
                  <div key={i}>
                    {renderCard(card, gameState === 'playing' && i === 1)}
                  </div>
                ))}
              </div>
            </div>

            {/* Result Banner */}
            {resultInfo && (
              <div className={`text-center py-4 mb-4 rounded-xl bg-black/50 ${resultInfo.color}`}>
                <resultInfo.icon className="w-12 h-12 mx-auto mb-2" />
                <p className="text-2xl font-bold">{resultInfo.text}</p>
              </div>
            )}

            {/* Player's Hand */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-amber-300 font-semibold">Your Hand</span>
                <span className="text-white font-bold">({getPlayerTotal()})</span>
                {getPlayerTotal() === 21 && <span className="text-green-400 font-bold">BLACKJACK!</span>}
              </div>
              <div className="flex gap-3 flex-wrap">
                {playerHand.map((card, i) => (
                  <div key={i}>{renderCard(card)}</div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 flex-wrap">
              {gameState === 'playing' && (
                <>
                  <Button 
                    onClick={hit}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={deck.length === 0}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Hit
                  </Button>
                  <Button 
                    onClick={stand}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Hand className="w-4 h-4 mr-2" /> Stand
                  </Button>
                </>
              )}
              
              {gameState === 'ended' && (
                <>
                  <Button 
                    onClick={() => setShowLearning(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <BookOpen className="w-4 h-4 mr-2" /> Learn About Cards
                  </Button>
                  <Button 
                    onClick={startGame}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" /> Play Again
                  </Button>
                </>
              )}
            </div>
          </>
        )}

        {/* Learning Modal */}
        <Dialog open={showLearning} onOpenChange={setShowLearning}>
          <DialogContent className="bg-slate-900 border-purple-500 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-amber-400 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Cards This Round
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {[...playerHand, ...dealerHand].map((card, i) => (
                <div key={i} className="p-4 bg-white/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-amber-300">{card.name}</h3>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-purple-600 rounded text-sm">Value: {card.raw_value}</span>
                      <span className="px-2 py-1 bg-pink-600 rounded text-sm">Reduces to: {card.reduced_value}</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm capitalize mb-2">Category: {card.category}</p>
                  {card.short_bio && <p className="text-gray-200 mb-2">{card.short_bio}</p>}
                  {card.numerology_insight && (
                    <p className="text-purple-300 italic text-sm">✨ {card.numerology_insight}</p>
                  )}
                  {card.life_path && (
                    <p className="text-amber-400 text-sm mt-2">Life Path: {card.life_path}</p>
                  )}
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}