import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { Sparkles, RotateCcw, Plus, Hand, Trophy, Skull, BookOpen, Loader2, Gamepad2, ArrowLeft, History, Users, Crown, Coins, AlertTriangle, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import BlackjackCard, { getGameValue } from '../components/blackjack/BlackjackCard';
import BettingPanel from '../components/blackjack/BettingPanel';
import GameHistory from '../components/blackjack/GameHistory';
import Leaderboard from '../components/blackjack/Leaderboard';
import ResultAnimation from '../components/blackjack/ResultAnimation';
import CoopMode from '../components/blackjack/CoopMode';
import { STARTING_BALANCE, BLACKJACK_MULTIPLIER, MINIMUM_BET } from '@/constants/blackjackConstants';

export default function NumerologyBlackjack() {
  const [user, setUser] = useState(null);
  const [familyId, setFamilyId] = useState(null);
  const [allCards, setAllCards] = useState([]);
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [partnerHand, setPartnerHand] = useState([]);
  const [gameState, setGameState] = useState('menu'); // menu, betting, playing, dealerTurn, ended
  const [gameMode, setGameMode] = useState('solo'); // solo, tournament, coop
  const [result, setResult] = useState(null);
  const [showLearning, setShowLearning] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showCoopSetup, setShowCoopSetup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [accessDenied, setAccessDenied] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  
  // Bankruptcy system
  const [bankruptcyCount, setBankruptcyCount] = useState(0);
  const [showBankruptcyDialog, setShowBankruptcyDialog] = useState(false);
  
  // Betting system
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [currentBet, setCurrentBet] = useState(0);
  const [payout, setPayout] = useState(0);
  const [showResultAnimation, setShowResultAnimation] = useState(false);
  
  // Co-op
  const [coopPartner, setCoopPartner] = useState(null);
  
  // New cards tracking for animation
  const [newCardIndices, setNewCardIndices] = useState({ player: [], dealer: [], partner: [] });

  useEffect(() => {
    checkAccessAndLoadCards();
  }, []);

  // Auto-detect bankruptcy (balance too low to play)
  useEffect(() => {
    if (balance < MINIMUM_BET && balance >= 0 && !showBankruptcyDialog && gameState === 'menu') {
      setShowBankruptcyDialog(true);
    }
  }, [balance, gameState, showBankruptcyDialog]);

  const checkAccessAndLoadCards = async () => {
    const currentUser = await base44.auth.me();
    setUser(currentUser);
    
    // Load user's saved balance and bankruptcy count
    if (currentUser.blackjack_balance !== undefined) {
      setBalance(currentUser.blackjack_balance);
    } else {
      // First time player - give starting balance
      await base44.auth.updateMe({ blackjack_balance: STARTING_BALANCE });
    }
    
    // Load bankruptcy count
    if (currentUser.bankruptcy_count !== undefined) {
      setBankruptcyCount(currentUser.bankruptcy_count);
    }
    
    let members = await base44.entities.FamilyMember.filter({ email: currentUser.email });
    let selfMember = members.find(m => m.relationship === 'self') || members[0];
    
    if (!selfMember) {
      const createdMembers = await base44.entities.FamilyMember.filter({ created_by: currentUser.email });
      selfMember = createdMembers[0];
    }
    
    if (selfMember?.family_id) {
      setFamilyId(selfMember.family_id);
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

  const saveBalance = async (newBalance) => {
    setBalance(newBalance);
    await base44.auth.updateMe({ blackjack_balance: newBalance });
  };

  const handleBankruptcyReset = async () => {
    const newCount = bankruptcyCount + 1;
    setBankruptcyCount(newCount);
    await saveBalance(STARTING_BALANCE);
    await base44.auth.updateMe({ bankruptcy_count: newCount });
    setShowBankruptcyDialog(false);
  };

  const getPlayerTotal = () => playerHand.reduce((sum, card) => sum + getGameValue(card), 0);
  const getDealerTotal = () => dealerHand.reduce((sum, card) => sum + getGameValue(card), 0);
  const getPartnerTotal = () => partnerHand.reduce((sum, card) => sum + getGameValue(card), 0);

  const shuffleDeck = (cards) => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startGame = () => {
    // Check for minimum bet
    if (currentBet < MINIMUM_BET) {
      toast.error(`Minimum bet is ${MINIMUM_BET} chips`);
      return;
    }
    
    // Check for sufficient balance
    if (balance < currentBet) {
      toast.error('Insufficient balance for this bet');
      return;
    }
    
    let cardsToUse = allCards;
    if (selectedCategory !== 'all') {
      cardsToUse = allCards.filter(c => c.category === selectedCategory);
    }
    
    if (cardsToUse.length < 10) {
      toast.error('Not enough cards in this category. Need at least 10.');
      return;
    }

    // Deduct bet from balance
    saveBalance(balance - currentBet);

    const shuffled = shuffleDeck(cardsToUse);
    const newDeck = [...shuffled];
    
    // Deal cards
    const pHand = [newDeck.pop(), newDeck.pop()];
    const dHand = [newDeck.pop(), newDeck.pop()];
    let partHand = [];
    
    if (gameMode === 'coop' && coopPartner) {
      partHand = [newDeck.pop(), newDeck.pop()];
    }
    
    setDeck(newDeck);
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setPartnerHand(partHand);
    setNewCardIndices({ player: [0, 1], dealer: [0, 1], partner: [0, 1] });
    setGameState('playing');
    setResult(null);
    setPayout(0);

    // Check for natural blackjack
    const playerTotal = pHand.reduce((sum, card) => sum + getGameValue(card), 0);
    if (playerTotal === 21) {
      setTimeout(() => {
        setGameState('dealerTurn');
        dealerPlayWithHands(dHand, newDeck, pHand, partHand);
      }, 1000);
    }
  };

  const hit = () => {
    if (deck.length === 0) return;
    
    const newDeck = [...deck];
    const newCard = newDeck.pop();
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    setDeck(newDeck);
    setNewCardIndices(prev => ({ ...prev, player: [newHand.length - 1] }));

    const total = newHand.reduce((sum, card) => sum + getGameValue(card), 0);
    if (total > 21) {
      endGame('bust', newHand, dealerHand);
    } else if (total === 21) {
      stand();
    }
  };

  const stand = () => {
    setGameState('dealerTurn');
    dealerPlayWithHands(dealerHand, deck, playerHand, partnerHand);
  };

  const dealerPlayWithHands = (dHand, currentDeck, pHand, partHand) => {
    let newDealerHand = [...dHand];
    let newDeck = [...currentDeck];
    const newDealerCardIndices = [];
    
    // Dealer hits until 17 or higher
    while (newDealerHand.reduce((sum, card) => sum + getGameValue(card), 0) < 17 && newDeck.length > 0) {
      newDealerHand.push(newDeck.pop());
      newDealerCardIndices.push(newDealerHand.length - 1);
    }
    
    setDealerHand(newDealerHand);
    setDeck(newDeck);
    setNewCardIndices(prev => ({ ...prev, dealer: newDealerCardIndices }));
    
    // Determine result
    setTimeout(() => {
      const dealerTotal = newDealerHand.reduce((sum, card) => sum + getGameValue(card), 0);
      const playerTotal = pHand.reduce((sum, card) => sum + getGameValue(card), 0);

      let gameResult;
      if (playerTotal === 21 && pHand.length === 2) {
        gameResult = 'blackjack';
      } else if (dealerTotal > 21) {
        gameResult = 'dealerBust';
      } else if (dealerTotal > playerTotal) {
        gameResult = 'lose';
      } else if (playerTotal > dealerTotal) {
        gameResult = 'win';
      } else {
        gameResult = 'push';
      }

      endGame(gameResult, pHand, newDealerHand);
    }, 500);
  };

  const endGame = async (res, finalPlayerHand, finalDealerHand) => {
    setResult(res);
    setGameState('ended');
    
    // Calculate payout
    let winnings = 0;
    if (res === 'blackjack') {
      winnings = Math.floor(currentBet * BLACKJACK_MULTIPLIER);
    } else if (res === 'win' || res === 'dealerBust') {
      winnings = currentBet * 2;
    } else if (res === 'push') {
      winnings = currentBet; // Return bet
    }
    // Loss = 0 winnings (bet already deducted)

    const netPayout = winnings - (res === 'push' ? 0 : (winnings > 0 ? 0 : 0));
    const actualPayout = winnings > 0 ? winnings : -currentBet;
    
    setPayout(actualPayout);
    
    if (winnings > 0) {
      await saveBalance(balance + winnings);
    }
    
    // Show result animation
    setShowResultAnimation(true);

    // Save game record
    await base44.entities.BlackjackGame.create({
      player_email: user.email,
      family_id: familyId,
      game_mode: gameMode,
      bet_amount: currentBet,
      result: res,
      payout: actualPayout,
      player_total: finalPlayerHand.reduce((sum, card) => sum + getGameValue(card), 0),
      dealer_total: finalDealerHand.reduce((sum, card) => sum + getGameValue(card), 0),
      player_cards: JSON.stringify(finalPlayerHand.map(c => c.name)),
      dealer_cards: JSON.stringify(finalDealerHand.map(c => c.name)),
      deck_category: selectedCategory,
      coop_partner_email: coopPartner?.email
    });
  };

  const resetToMenu = () => {
    setGameState('menu');
    setCurrentBet(0);
    setPlayerHand([]);
    setDealerHand([]);
    setPartnerHand([]);
    setResult(null);
    setPayout(0);
    setShowResultAnimation(false);
  };

  const startNewRound = () => {
    setGameState('betting');
    setCurrentBet(0);
    setPlayerHand([]);
    setDealerHand([]);
    setPartnerHand([]);
    setResult(null);
    setPayout(0);
    setShowResultAnimation(false);
  };

  const handleStartCoop = (partner) => {
    setCoopPartner(partner);
    setShowCoopSetup(false);
    setGameMode('coop');
    setGameState('betting');
  };

  if (checkingAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-green-950 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-green-950 p-6 flex items-center justify-center">
        <Card className="bg-black/30 border-green-700 max-w-md">
          <CardContent className="py-12 text-center">
            <Gamepad2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Blackjack Disabled</h2>
            <p className="text-green-200">This game has been disabled by your family admin.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-green-950 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to={createPageUrl('Games')}>
            <Button variant="ghost" className="text-green-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Games
            </Button>
          </Link>
          
          <div className="flex items-center gap-4">
            <motion.div 
              key={balance}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                balance < MINIMUM_BET 
                  ? 'bg-red-900/50 border border-red-500' 
                  : balance < 50 
                  ? 'bg-amber-900/50 border border-amber-500' 
                  : 'bg-black/30'
              }`}
            >
              <Coins className={`w-5 h-5 ${
                balance < MINIMUM_BET 
                  ? 'text-red-400' 
                  : balance < 50 
                  ? 'text-amber-400 animate-pulse' 
                  : 'text-amber-400'
              }`} />
              <span className={`font-bold ${
                balance < MINIMUM_BET 
                  ? 'text-red-400' 
                  : balance < 50 
                  ? 'text-amber-400' 
                  : 'text-amber-400'
              }`}>
                {balance.toLocaleString()}
              </span>
              {balance < MINIMUM_BET && (
                <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
              )}
            </motion.div>
            
            {balance < MINIMUM_BET && (
              <Button
                onClick={() => setShowBankruptcyDialog(true)}
                size="sm"
                className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
              >
                <DollarSign className="w-4 h-4 mr-1" />
                Reset Balance
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHistory(true)}
              className="text-green-300 hover:text-white hover:bg-white/10"
            >
              <History className="w-5 h-5" />
            </Button>
            
            {familyId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLeaderboard(true)}
                className="text-green-300 hover:text-white hover:bg-white/10"
              >
                <Crown className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-amber-400 mb-2">Numerology Blackjack</h1>
          <p className="text-green-200">Hit 21 with the power of names</p>
          {gameMode !== 'solo' && (
            <p className="text-purple-400 text-sm mt-1">
              {gameMode === 'tournament' ? '🏆 Tournament Mode' : `👥 Co-op with ${coopPartner?.nickname || coopPartner?.full_name}`}
            </p>
          )}
          {bankruptcyCount > 0 && (
            <p className="text-gray-500 text-xs mt-1">
              Bailouts used: {bankruptcyCount}
            </p>
          )}
        </motion.div>

        {/* Game Menu */}
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto"
          >
            <Card className="bg-black/30 border-green-700">
              <CardContent className="py-8 space-y-6">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                  <h2 className="text-2xl text-white mb-2">Choose Game Mode</h2>
                </div>

                <div className="grid gap-3">
                  <Button
                    onClick={() => { setGameMode('solo'); setGameState('betting'); }}
                    disabled={balance < MINIMUM_BET}
                    className="w-full py-6 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Gamepad2 className="w-5 h-5 mr-2" />
                    Solo Play
                  </Button>
                  
                  {familyId && (
                    <>
                      <Button
                        onClick={() => { setGameMode('tournament'); setGameState('betting'); }}
                        disabled={balance < MINIMUM_BET}
                        className="w-full py-6 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Crown className="w-5 h-5 mr-2" />
                        Tournament Mode
                      </Button>
                      
                      <Button
                        onClick={() => setShowCoopSetup(true)}
                        disabled={balance < MINIMUM_BET}
                        className="w-full py-6 bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Users className="w-5 h-5 mr-2" />
                        Co-op Mode
                      </Button>
                    </>
                  )}
                </div>

                {balance < MINIMUM_BET && (
                  <div className="mt-4 p-3 bg-red-900/30 border border-red-500 rounded-lg">
                    <p className="text-red-400 text-sm text-center flex items-center justify-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Balance too low to play. Use the "Reset Balance" button above.
                    </p>
                  </div>
                )}

                {/* Category Selection */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-gray-400 text-sm mb-3 text-center">Choose Card Deck</p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {['all', 'biblical', 'historical', 'sports', 'rock'].map(cat => (
                      <Button
                        key={cat}
                        variant={selectedCategory === cat ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(cat)}
                        className={selectedCategory === cat 
                          ? 'bg-amber-600 hover:bg-amber-700' 
                          : 'border-green-500/50 text-green-300 hover:bg-green-800/50'
                        }
                      >
                        {cat === 'all' ? '🎴 All' : cat === 'biblical' ? '📖' : cat === 'historical' ? '🏛️' : cat === 'sports' ? '🏆' : '🎸'}
                        <span className="ml-1 capitalize">{cat}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Betting Phase */}
        {gameState === 'betting' && (
          <div className="max-w-md mx-auto">
            {balance < MINIMUM_BET && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-red-900/30 border border-red-500 rounded-lg"
              >
                <p className="text-red-400 text-sm text-center flex items-center justify-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Your balance is too low. You need at least {MINIMUM_BET} chips to play.
                </p>
                <Button
                  onClick={() => setShowBankruptcyDialog(true)}
                  className="w-full mt-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Reset Balance to {STARTING_BALANCE}
                </Button>
              </motion.div>
            )}
            <BettingPanel
              balance={balance}
              currentBet={currentBet}
              onBetChange={setCurrentBet}
              onDeal={startGame}
              disabled={allCards.length < 10 || balance < MINIMUM_BET}
            />
            <Button
              variant="ghost"
              onClick={resetToMenu}
              className="w-full mt-4 text-gray-400 hover:text-white"
            >
              Back to Menu
            </Button>
          </div>
        )}

        {/* Game Play */}
        {(gameState === 'playing' || gameState === 'dealerTurn' || gameState === 'ended') && (
          <div className="space-y-8">
            {/* Dealer's Hand */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-green-300 font-semibold">Dealer</span>
                {gameState !== 'playing' && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-white font-bold bg-black/30 px-3 py-1 rounded-full"
                  >
                    {getDealerTotal()}
                  </motion.span>
                )}
              </div>
              <div className="flex gap-3 flex-wrap">
                {dealerHand.map((card, i) => (
                  <BlackjackCard
                    key={i}
                    card={card}
                    faceDown={gameState === 'playing' && i === 1}
                    index={i}
                    isNew={newCardIndices.dealer.includes(i)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Player's Hand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-amber-300 font-semibold">Your Hand</span>
                <motion.span
                  key={getPlayerTotal()}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  className={`font-bold px-3 py-1 rounded-full ${
                    getPlayerTotal() === 21 ? 'bg-green-500 text-white' :
                    getPlayerTotal() > 21 ? 'bg-red-500 text-white' :
                    'bg-black/30 text-white'
                  }`}
                >
                  {getPlayerTotal()}
                </motion.span>
                {getPlayerTotal() === 21 && playerHand.length === 2 && (
                  <motion.span
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-amber-400 font-bold"
                  >
                    ✨ BLACKJACK!
                  </motion.span>
                )}
              </div>
              <div className="flex gap-3 flex-wrap">
                {playerHand.map((card, i) => (
                  <BlackjackCard
                    key={i}
                    card={card}
                    index={i}
                    isNew={newCardIndices.player.includes(i)}
                    isWinning={gameState === 'ended' && (result === 'win' || result === 'dealerBust' || result === 'blackjack')}
                  />
                ))}
              </div>
            </motion.div>

            {/* Co-op Partner's Hand */}
            {gameMode === 'coop' && partnerHand.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-purple-300 font-semibold">
                    {coopPartner?.nickname || coopPartner?.full_name}'s Hand
                  </span>
                  <span className="text-white font-bold bg-black/30 px-3 py-1 rounded-full">
                    {getPartnerTotal()}
                  </span>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {partnerHand.map((card, i) => (
                    <BlackjackCard key={i} card={card} index={i} isNew={newCardIndices.partner.includes(i)} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Current Bet Display */}
            <div className="text-center">
              <span className="text-gray-400">Current Bet: </span>
              <span className="text-amber-400 font-bold">{currentBet}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 flex-wrap">
              {gameState === 'playing' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <Button 
                    onClick={hit}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 px-8"
                    disabled={deck.length === 0}
                  >
                    <Plus className="w-5 h-5 mr-2" /> Hit
                  </Button>
                  <Button 
                    onClick={stand}
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 px-8"
                  >
                    <Hand className="w-5 h-5 mr-2" /> Stand
                  </Button>
                </motion.div>
              )}
              
              {gameState === 'ended' && !showResultAnimation && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4 flex-wrap justify-center"
                >
                  <Button 
                    onClick={() => setShowLearning(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <BookOpen className="w-4 h-4 mr-2" /> Learn About Cards
                  </Button>
                  <Button 
                    onClick={startNewRound}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" /> Play Again
                  </Button>
                  <Button 
                    onClick={resetToMenu}
                    variant="outline"
                    className="border-white/20 text-gray-300 hover:bg-white/10"
                  >
                    Back to Menu
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Result Animation Overlay */}
        <AnimatePresence>
          {showResultAnimation && result && (
            <ResultAnimation
              result={result}
              payout={payout}
              onComplete={() => setShowResultAnimation(false)}
            />
          )}
        </AnimatePresence>

        {/* History Dialog */}
        <Dialog open={showHistory} onOpenChange={setShowHistory}>
          <DialogContent className="bg-slate-900 border-green-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-amber-400 flex items-center gap-2">
                <History className="w-5 h-5" /> Game History
              </DialogTitle>
            </DialogHeader>
            {user && <GameHistory userEmail={user.email} onClose={() => setShowHistory(false)} />}
          </DialogContent>
        </Dialog>

        {/* Leaderboard Dialog */}
        <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
          <DialogContent className="bg-slate-900 border-amber-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-amber-400 flex items-center gap-2">
                <Crown className="w-5 h-5" /> Family Leaderboard
              </DialogTitle>
            </DialogHeader>
            {familyId && user && (
              <Leaderboard familyId={familyId} currentUserEmail={user.email} />
            )}
          </DialogContent>
        </Dialog>

        {/* Co-op Setup Dialog */}
        <Dialog open={showCoopSetup} onOpenChange={setShowCoopSetup}>
          <DialogContent className="bg-slate-900 border-purple-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-purple-400 flex items-center gap-2">
                <Users className="w-5 h-5" /> Co-op Mode
              </DialogTitle>
            </DialogHeader>
            {familyId && user && (
              <CoopMode
                familyId={familyId}
                currentUserEmail={user.email}
                onStartCoop={handleStartCoop}
                onCancel={() => setShowCoopSetup(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Bankruptcy Reset Dialog */}
        <AlertDialog open={showBankruptcyDialog} onOpenChange={setShowBankruptcyDialog}>
          <AlertDialogContent className="bg-slate-900 border-red-700 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                Balance Too Low
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                Your balance is below the minimum bet of {MINIMUM_BET} chips. You cannot continue playing.
                {bankruptcyCount > 0 && (
                  <p className="mt-2 text-amber-400">
                    You've used {bankruptcyCount} bailout{bankruptcyCount !== 1 ? 's' : ''} so far.
                  </p>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="my-4 p-4 bg-green-900/20 rounded-lg border border-green-700">
              <p className="text-green-300 font-semibold mb-2">Emergency Bailout Available!</p>
              <p className="text-gray-300 text-sm">
                Reset your balance to {STARTING_BALANCE.toLocaleString()} chips and continue playing. 
                This will be tracked as a bailout.
              </p>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white">
                Maybe Later
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleBankruptcyReset}
                className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Reset Balance
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Learning Modal */}
        <Dialog open={showLearning} onOpenChange={setShowLearning}>
          <DialogContent className="bg-slate-900 border-purple-500 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-amber-400 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Cards This Round
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {[...playerHand, ...dealerHand, ...partnerHand].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-white/10 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-amber-300">{card.name}</h3>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-purple-600 rounded text-sm">Value: {card.raw_value}</span>
                      <span className="px-2 py-1 bg-pink-600 rounded text-sm">Game: {getGameValue(card)}</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm capitalize mb-2">Category: {card.category}</p>
                  {card.short_bio && <p className="text-gray-200 mb-2">{card.short_bio}</p>}
                  {card.numerology_insight && (
                    <p className="text-purple-300 italic text-sm">✨ {card.numerology_insight}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}