import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Trophy, Medal, Crown, Loader2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Leaderboard({ familyId, currentUserEmail }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all'); // all, week, today

  useEffect(() => {
    loadLeaderboard();
  }, [familyId, timeframe]);

  const loadLeaderboard = async () => {
    setLoading(true);
    
    // Get all games for this family
    let games = await base44.entities.BlackjackGame.filter({ family_id: familyId });
    
    // Filter by timeframe
    const now = new Date();
    if (timeframe === 'today') {
      const today = now.toISOString().split('T')[0];
      games = games.filter(g => g.created_date?.startsWith(today));
    } else if (timeframe === 'week') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      games = games.filter(g => new Date(g.created_date) >= weekAgo);
    }

    // Aggregate by player
    const playerStats = {};
    games.forEach(game => {
      if (!playerStats[game.player_email]) {
        playerStats[game.player_email] = {
          email: game.player_email,
          wins: 0,
          games: 0,
          profit: 0,
          blackjacks: 0
        };
      }
      playerStats[game.player_email].games++;
      if (game.result === 'win' || game.result === 'dealerBust' || game.result === 'blackjack') {
        playerStats[game.player_email].wins++;
      }
      if (game.result === 'blackjack') {
        playerStats[game.player_email].blackjacks++;
      }
      playerStats[game.player_email].profit += game.payout || 0;
    });

    // Convert to array and sort by profit
    const sorted = Object.values(playerStats)
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 10);

    setLeaderboard(sorted);
    setLoading(false);
  };

  const getRankIcon = (rank) => {
    if (rank === 0) return <Crown className="w-6 h-6 text-amber-400" />;
    if (rank === 1) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-amber-700" />;
    return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">{rank + 1}</span>;
  };

  const getRankBg = (rank) => {
    if (rank === 0) return 'bg-gradient-to-r from-amber-500/30 to-yellow-500/30 border-amber-500/50';
    if (rank === 1) return 'bg-gradient-to-r from-gray-400/20 to-gray-300/20 border-gray-400/50';
    if (rank === 2) return 'bg-gradient-to-r from-amber-700/20 to-amber-600/20 border-amber-700/50';
    return 'bg-white/5 border-white/10';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Timeframe Selector */}
      <div className="flex justify-center gap-2 mb-6">
        {[
          { key: 'today', label: 'Today' },
          { key: 'week', label: 'This Week' },
          { key: 'all', label: 'All Time' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTimeframe(key)}
            className={`px-4 py-2 rounded-lg transition-all ${
              timeframe === key
                ? 'bg-amber-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      {leaderboard.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No games played yet in this timeframe</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((player, idx) => (
            <motion.div
              key={player.email}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-xl border ${getRankBg(idx)} ${
                player.email === currentUserEmail ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {getRankIcon(idx)}
                <div>
                  <p className="font-semibold text-white">
                    {player.email.split('@')[0]}
                    {player.email === currentUserEmail && (
                      <span className="text-purple-400 text-sm ml-2">(You)</span>
                    )}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {player.games} games • {player.wins} wins
                    {player.blackjacks > 0 && (
                      <span className="text-amber-400 ml-2">• {player.blackjacks} BJ</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${player.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {player.profit >= 0 ? '+' : ''}{player.profit.toLocaleString()}
                </p>
                <p className="text-gray-500 text-xs">
                  {((player.wins / player.games) * 100).toFixed(0)}% win rate
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}