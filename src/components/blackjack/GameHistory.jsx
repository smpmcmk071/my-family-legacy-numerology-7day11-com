import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Skull, Minus, TrendingUp, TrendingDown, Calendar, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GameHistory({ userEmail, onClose }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ wins: 0, losses: 0, pushes: 0, totalWon: 0, totalLost: 0, streak: 0 });

  useEffect(() => {
    loadHistory();
  }, [userEmail]);

  const loadHistory = async () => {
    const allGames = await base44.entities.BlackjackGame.filter({ player_email: userEmail }, '-created_date', 50);
    setGames(allGames);

    // Calculate stats
    let wins = 0, losses = 0, pushes = 0, totalWon = 0, totalLost = 0;
    let currentStreak = 0;
    let streakType = null;

    allGames.forEach((game, idx) => {
      if (game.result === 'win' || game.result === 'dealerBust' || game.result === 'blackjack') {
        wins++;
        totalWon += game.payout || 0;
        if (idx === 0 || streakType === 'win') {
          currentStreak++;
          streakType = 'win';
        }
      } else if (game.result === 'push') {
        pushes++;
        streakType = null;
      } else {
        losses++;
        totalLost += game.bet_amount || 0;
        if (idx === 0 || streakType === 'loss') {
          currentStreak = streakType === 'loss' ? currentStreak - 1 : -1;
          streakType = 'loss';
        }
      }
    });

    setStats({ wins, losses, pushes, totalWon, totalLost, streak: streakType === 'win' ? currentStreak : currentStreak });
    setLoading(false);
  };

  const getResultIcon = (result) => {
    if (result === 'win' || result === 'dealerBust' || result === 'blackjack') {
      return <Trophy className="w-4 h-4 text-green-400" />;
    } else if (result === 'push') {
      return <Minus className="w-4 h-4 text-yellow-400" />;
    }
    return <Skull className="w-4 h-4 text-red-400" />;
  };

  const getResultColor = (result) => {
    if (result === 'win' || result === 'dealerBust' || result === 'blackjack') return 'text-green-400';
    if (result === 'push') return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  const winRate = games.length > 0 ? ((stats.wins / games.length) * 100).toFixed(1) : 0;
  const netProfit = stats.totalWon - stats.totalLost;

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/20 rounded-xl p-4 text-center border border-green-500/30"
        >
          <Trophy className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-400">{stats.wins}</p>
          <p className="text-gray-400 text-sm">Wins</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-red-500/20 rounded-xl p-4 text-center border border-red-500/30"
        >
          <Skull className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-red-400">{stats.losses}</p>
          <p className="text-gray-400 text-sm">Losses</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-purple-500/20 rounded-xl p-4 text-center border border-purple-500/30"
        >
          <p className="text-2xl font-bold text-purple-400">{winRate}%</p>
          <p className="text-gray-400 text-sm">Win Rate</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-xl p-4 text-center border ${
            netProfit >= 0 ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'
          }`}
        >
          {netProfit >= 0 ? (
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
          ) : (
            <TrendingDown className="w-6 h-6 text-red-400 mx-auto mb-2" />
          )}
          <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString()}
          </p>
          <p className="text-gray-400 text-sm">Net Profit</p>
        </motion.div>
      </div>

      {/* Current Streak */}
      {stats.streak !== 0 && (
        <div className={`text-center py-3 rounded-lg ${
          stats.streak > 0 ? 'bg-green-500/20' : 'bg-red-500/20'
        }`}>
          <p className={stats.streak > 0 ? 'text-green-400' : 'text-red-400'}>
            🔥 Current Streak: {Math.abs(stats.streak)} {stats.streak > 0 ? 'Wins' : 'Losses'}
          </p>
        </div>
      )}

      {/* Recent Games */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-400" />
          Recent Games
        </h3>
        
        {games.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No games played yet</p>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {games.slice(0, 20).map((game, idx) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between bg-white/5 rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  {getResultIcon(game.result)}
                  <div>
                    <p className={`font-medium capitalize ${getResultColor(game.result)}`}>
                      {game.result === 'dealerBust' ? 'Dealer Bust' : game.result}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {game.player_total} vs {game.dealer_total} • {game.deck_category || 'all'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    game.payout > 0 ? 'text-green-400' : game.payout < 0 ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {game.payout > 0 ? '+' : ''}{game.payout || 0}
                  </p>
                  <p className="text-gray-500 text-xs">Bet: {game.bet_amount || 0}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}