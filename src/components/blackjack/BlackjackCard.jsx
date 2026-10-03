import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

// Cards whose reduced value is 2 act as flexible aces (11 or 1) for blackjack.
// All other cards use their reduced value (1–9).
const isAce = (card) => {
  let num = card.reduced_value || card.raw_value || 5;
  while (num > 9) {
    num = String(num).split('').reduce((a, b) => a + parseInt(b), 0);
  }
  return num === 2;
};

const getGameValue = (card) => {
  let num = card.reduced_value || card.raw_value || 5;
  while (num > 9) {
    num = String(num).split('').reduce((a, b) => a + parseInt(b), 0);
  }
  return num;
};

// Compute the best total for a hand, treating aces as 11 then downgrading to 1 to avoid busts.
const getHandTotal = (hand) => {
  let total = 0;
  let aces = 0;
  for (const card of hand) {
    if (isAce(card)) {
      aces += 1;
      total += 11;
    } else {
      total += getGameValue(card);
    }
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
};

// True if a hand's total was achieved without any ace-downgrade (used for soft-17 dealer rule).
const isSoft = (hand) => {
  let total = 0;
  let aces = 0;
  for (const card of hand) {
    if (isAce(card)) {
      aces += 1;
      total += 11;
    } else {
      total += getGameValue(card);
    }
  }
  // If no downgrade was needed, it's soft
  let workingAces = aces;
  let workingTotal = total;
  while (workingTotal > 21 && workingAces > 0) {
    workingTotal -= 10;
    workingAces -= 1;
  }
  return workingAces > 0 && workingTotal <= 21;
};

export default function BlackjackCard({ card, faceDown = false, index = 0, isNew = false, isWinning = false }) {
  const gameVal = getGameValue(card);
  const rawVal = card.raw_value || 0;
  const reducedVal = card.reduced_value || gameVal;
  const ace = isAce(card);
  const displayVal = ace ? 'A' : gameVal;
  const cornerVal = ace ? 11 : gameVal;

  return (
    <motion.div
      initial={isNew ? { rotateY: 180, scale: 0.5, opacity: 0 } : false}
      animate={{ rotateY: 0, scale: 1, opacity: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 200
      }}
      whileHover={{ scale: 1.08, y: -5 }}
      className={`relative w-24 h-36 rounded-xl shadow-lg cursor-pointer ${
        isWinning ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-transparent' : ''
      }`}
    >
      <motion.div
        animate={isWinning ? { 
          boxShadow: ['0 0 20px rgba(34,197,94,0.5)', '0 0 40px rgba(34,197,94,0.8)', '0 0 20px rgba(34,197,94,0.5)']
        } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
        className={`absolute inset-0 rounded-xl ${
          faceDown 
            ? 'bg-gradient-to-br from-purple-800 to-indigo-900' 
            : 'bg-gradient-to-br from-amber-100 to-amber-50'
        }`}
      >
        {faceDown ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-amber-400" />
            </motion.div>
            <div className="absolute inset-2 border-2 border-amber-400/30 rounded-lg" />
          </div>
        ) : (
          <div className="absolute inset-0 p-2 flex flex-col">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className={`text-2xl font-bold text-center ${ace ? 'text-rose-700' : 'text-purple-900'}`}
            >
              {displayVal}
            </motion.div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs text-center text-purple-800 font-semibold px-1 leading-tight">
                {card.name}
              </p>
            </div>
            <div className="text-[10px] text-center text-purple-500">
              {rawVal}/{reducedVal}{ace ? `→${cornerVal}` : (reducedVal !== gameVal ? `→${gameVal}` : '')}
            </div>
            <div className="text-xs text-center text-purple-600 capitalize">{card.category}</div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export { getGameValue, getHandTotal, isAce, isSoft };