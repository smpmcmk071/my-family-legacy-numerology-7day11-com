import React from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Minus, Plus, Sparkles, AlertTriangle } from 'lucide-react';

const CHIP_VALUES = [10, 25, 50, 100, 250, 500];
const MINIMUM_BET = 10;
const CHIP_COLORS = {
  10: 'from-blue-500 to-blue-700',
  25: 'from-green-500 to-green-700',
  50: 'from-red-500 to-red-700',
  100: 'from-purple-500 to-purple-700',
  250: 'from-amber-500 to-amber-700',
  500: 'from-pink-500 to-pink-700'
};

export default function BettingPanel({ balance, currentBet, onBetChange, onDeal, disabled }) {
  const addToBet = (amount) => {
    if (balance >= amount) {
      onBetChange(currentBet + amount);
    }
  };

  const clearBet = () => onBetChange(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 rounded-2xl p-6 border border-amber-500/30"
    >
      {/* Balance Display */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <Coins className={`w-8 h-8 ${balance < MINIMUM_BET ? 'text-red-400' : balance < 50 ? 'text-amber-400' : 'text-amber-400'}`} />
        <div className="text-center">
          <p className="text-gray-400 text-sm">Your Balance</p>
          <motion.p
            key={balance}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className={`text-3xl font-bold ${
              balance < MINIMUM_BET ? 'text-red-400' : 
              balance < 50 ? 'text-amber-400' : 
              'text-amber-400'
            }`}
          >
            {balance.toLocaleString()}
          </motion.p>
          {balance < MINIMUM_BET && (
            <p className="text-red-400 text-xs mt-1 flex items-center justify-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Too low to play
            </p>
          )}
          {balance >= MINIMUM_BET && balance < 50 && (
            <p className="text-amber-400 text-xs mt-1 flex items-center justify-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Running low!
            </p>
          )}
        </div>
      </div>

      {/* Current Bet */}
      <div className="text-center mb-6">
        <p className="text-gray-400 text-sm mb-2">Current Bet</p>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={clearBet}
            disabled={currentBet === 0}
            className="border-red-500 text-red-400 hover:bg-red-500/20"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <motion.div
            key={currentBet}
            initial={{ scale: 1.3, color: '#fbbf24' }}
            animate={{ scale: 1, color: '#ffffff' }}
            className="text-4xl font-bold min-w-[120px]"
          >
            {currentBet}
          </motion.div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Chip Selection */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {CHIP_VALUES.map((value) => (
          <motion.button
            key={value}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addToBet(value)}
            disabled={balance < value}
            className={`relative w-full aspect-square rounded-full bg-gradient-to-br ${CHIP_COLORS[value]} 
              flex items-center justify-center font-bold text-white shadow-lg
              ${balance < value ? 'opacity-40 cursor-not-allowed' : 'hover:shadow-xl cursor-pointer'}
              border-4 border-white/30`}
          >
            <span className="text-lg">{value}</span>
            <div className="absolute inset-1 rounded-full border-2 border-dashed border-white/30" />
          </motion.button>
        ))}
      </div>

      {/* Deal Button */}
      <Button
        onClick={onDeal}
        disabled={currentBet === 0 || currentBet < MINIMUM_BET || disabled}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 
          text-xl py-6 disabled:opacity-50"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        Deal Cards
      </Button>

      {currentBet === 0 && (
        <p className="text-center text-gray-500 text-sm mt-3">Place a bet to start</p>
      )}
      {currentBet > 0 && currentBet < MINIMUM_BET && (
        <p className="text-center text-red-400 text-sm mt-3">
          Minimum bet is {MINIMUM_BET} chips
        </p>
      )}
    </motion.div>
  );
}