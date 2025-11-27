import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Skull, Hand, Sparkles, Coins } from 'lucide-react';

const confettiColors = ['#fbbf24', '#22c55e', '#3b82f6', '#ec4899', '#8b5cf6'];

export default function ResultAnimation({ result, payout, onComplete }) {
  const isWin = result === 'win' || result === 'dealerBust' || result === 'blackjack';
  const isPush = result === 'push';
  const isBlackjack = result === 'blackjack';

  const getConfig = () => {
    if (isBlackjack) {
      return {
        icon: Sparkles,
        title: 'BLACKJACK!',
        subtitle: '21 with numerology power!',
        color: 'text-amber-400',
        bgColor: 'from-amber-500/30 to-yellow-500/30',
        borderColor: 'border-amber-500'
      };
    }
    if (result === 'dealerBust') {
      return {
        icon: Trophy,
        title: 'Dealer Busts!',
        subtitle: 'You win!',
        color: 'text-green-400',
        bgColor: 'from-green-500/30 to-emerald-500/30',
        borderColor: 'border-green-500'
      };
    }
    if (isWin) {
      return {
        icon: Trophy,
        title: 'You Win!',
        subtitle: 'Great hand!',
        color: 'text-green-400',
        bgColor: 'from-green-500/30 to-emerald-500/30',
        borderColor: 'border-green-500'
      };
    }
    if (isPush) {
      return {
        icon: Hand,
        title: 'Push',
        subtitle: 'Tie game - bet returned',
        color: 'text-yellow-400',
        bgColor: 'from-yellow-500/30 to-amber-500/30',
        borderColor: 'border-yellow-500'
      };
    }
    return {
      icon: Skull,
      title: result === 'bust' ? 'Bust!' : 'Dealer Wins',
      subtitle: result === 'bust' ? 'Over 21' : 'Better luck next time',
      color: 'text-red-400',
      bgColor: 'from-red-500/30 to-rose-500/30',
      borderColor: 'border-red-500'
    };
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onComplete}
      >
        {/* Confetti for wins */}
        {isWin && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  rotate: 0,
                  scale: Math.random() * 0.5 + 0.5
                }}
                animate={{
                  y: window.innerHeight + 20,
                  rotate: Math.random() * 720 - 360,
                  x: Math.random() * window.innerWidth
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  delay: Math.random() * 0.5,
                  ease: "linear"
                }}
                className="absolute w-3 h-3 rounded-sm"
                style={{ backgroundColor: confettiColors[i % confettiColors.length] }}
              />
            ))}
          </div>
        )}

        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          className={`relative bg-gradient-to-br ${config.bgColor} backdrop-blur-lg rounded-3xl p-8 border-2 ${config.borderColor} 
            shadow-2xl max-w-md mx-4 text-center`}
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mb-4"
          >
            <Icon className={`w-20 h-20 mx-auto ${config.color}`} />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-4xl font-bold ${config.color} mb-2`}
          >
            {config.title}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 text-lg mb-6"
          >
            {config.subtitle}
          </motion.p>

          {/* Payout */}
          {payout !== 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.5 }}
              className={`flex items-center justify-center gap-2 text-3xl font-bold ${
                payout > 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              <Coins className="w-8 h-8" />
              {payout > 0 ? '+' : ''}{payout}
            </motion.div>
          )}

          {/* Click to continue */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white/50 text-sm mt-6"
          >
            Click anywhere to continue
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}