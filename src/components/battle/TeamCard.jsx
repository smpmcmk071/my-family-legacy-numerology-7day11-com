import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Swords, Shield, Wind, Zap, Skull } from 'lucide-react';
import NumberBadge from '@/components/legacy/NumberBadge';

export default function TeamCard({ team, members, isLeft, teamNumber }) {
  if (!team || team.length === 0) return null;
  
  // Calculate team totals
  const totalMaxHp = team.reduce((sum, p) => sum + p.health, 0);
  const totalCurrentHp = team.reduce((sum, p) => sum + (p.currentHp ?? p.health), 0);
  const hpPercent = (totalCurrentHp / totalMaxHp) * 100;
  
  return (
    <Card className={`bg-gradient-to-br ${isLeft ? 'from-blue-900/50 to-purple-900/50' : 'from-red-900/50 to-orange-900/50'} border-white/20 flex-1`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg">Team {teamNumber}</CardTitle>
        {/* Team HP Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-red-400 flex items-center gap-1">
              <Heart className="w-4 h-4" /> Team HP
            </span>
            <span className="text-white font-bold">
              {Math.max(0, Math.floor(totalCurrentHp))} / {totalMaxHp}
            </span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                hpPercent > 50 ? 'bg-green-500' : hpPercent > 25 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.max(0, hpPercent)}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {team.map((fighter, idx) => {
          const member = members.find(m => m.id === fighter.id);
          const isDefeated = (fighter.currentHp ?? fighter.health) <= 0;
          const fighterHpPercent = ((fighter.currentHp ?? fighter.health) / fighter.health) * 100;
          
          return (
            <div 
              key={fighter.id || idx}
              className={`p-3 rounded-lg border ${isDefeated ? 'bg-gray-900/50 border-gray-700 opacity-60' : 'bg-white/5 border-white/10'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {isDefeated && <Skull className="w-4 h-4 text-red-500" />}
                  <span className={`text-sm font-medium ${isDefeated ? 'text-gray-500 line-through' : 'text-white'}`}>
                    {fighter.name}
                  </span>
                  <NumberBadge number={member?.life_path_western} size="sm" />
                </div>
                <span className={`text-xs ${isDefeated ? 'text-red-500' : 'text-gray-400'}`}>
                  {Math.max(0, Math.floor(fighter.currentHp ?? fighter.health))}/{fighter.health}
                </span>
              </div>
              
              {/* Individual HP bar */}
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full transition-all duration-300 ${
                    fighterHpPercent > 50 ? 'bg-green-500' : fighterHpPercent > 25 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.max(0, fighterHpPercent)}%` }}
                />
              </div>
              
              {/* Mini stats */}
              <div className="grid grid-cols-4 gap-1 text-xs">
                <div className="flex items-center gap-1 text-orange-400">
                  <Swords className="w-3 h-3" />{fighter.attack}
                </div>
                <div className="flex items-center gap-1 text-blue-400">
                  <Shield className="w-3 h-3" />{fighter.defense}
                </div>
                <div className="flex items-center gap-1 text-green-400">
                  <Wind className="w-3 h-3" />{fighter.speed}
                </div>
                <div className="flex items-center gap-1 text-purple-400">
                  <Zap className="w-3 h-3" />{fighter.evasion}%
                </div>
              </div>
              
              {/* Abilities */}
              {fighter.abilities && fighter.abilities.length > 0 && !isDefeated && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {fighter.abilities.slice(0, 2).map((ability, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded text-xs">
                      {ability}
                    </span>
                  ))}
                  {fighter.abilities.length > 2 && (
                    <span className="text-xs text-gray-500">+{fighter.abilities.length - 2}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}