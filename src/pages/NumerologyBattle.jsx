import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { base44 } from '@/api/base44Client';
import { Swords, Zap, Shield, Heart, Wind, Sparkles, Trophy, RotateCcw, Loader2 } from 'lucide-react';
import NumberBadge from '../components/legacy/NumberBadge';

export default function NumerologyBattle() {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [player1Id, setPlayer1Id] = useState('');
  const [player2Id, setPlayer2Id] = useState('');
  const [player1Stats, setPlayer1Stats] = useState(null);
  const [player2Stats, setPlayer2Stats] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [battleState, setBattleState] = useState('select'); // select, ready, fighting, finished
  const [winner, setWinner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [accessDenied, setAccessDenied] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    loadFamilyMembers();
  }, []);

  const loadFamilyMembers = async () => {
    const user = await base44.auth.me();
    let members = await base44.entities.FamilyMember.filter({ email: user.email });
    let selfMember = members.find(m => m.relationship === 'self') || members[0];
    
    if (!selfMember) {
      const createdMembers = await base44.entities.FamilyMember.filter({ created_by: user.email });
      selfMember = createdMembers[0];
    }
    
    if (selfMember?.family_id) {
      // Check family settings
      const allFamilies = await base44.entities.Family.list();
      const family = allFamilies.find(f => f.id === selfMember.family_id);
      if (family && family.enable_battle === false) {
        setAccessDenied(true);
        setCheckingAccess(false);
        return;
      }
      
      const allMembers = await base44.entities.FamilyMember.filter({ family_id: selfMember.family_id });
      setFamilyMembers(allMembers.filter(m => m.life_path_western)); // Only members with numerology calculated
    }
    setCheckingAccess(false);
  };

  const loadBattleStats = async () => {
    if (!player1Id || !player2Id) return;
    
    setIsLoading(true);
    const response = await base44.functions.invoke('calculateBattleStats', {
      action: 'getBattlePreview',
      player1Id,
      player2Id
    });

    if (response.data?.success) {
      const p1Data = response.data.data.player1;
      const p2Data = response.data.data.player2;
      setPlayer1Stats({ 
        ...p1Data.stats, 
        name: p1Data.name,
        abilities: p1Data.stats.specialAbilities 
      });
      setPlayer2Stats({ 
        ...p2Data.stats, 
        name: p2Data.name,
        abilities: p2Data.stats.specialAbilities 
      });
      setBattleState('ready');
    }
    setIsLoading(false);
  };

  const startBattle = () => {
    if (!player1Stats || !player2Stats) return;
    
    setBattleState('fighting');
    setBattleLog([]);
    setCurrentTurn(0);
    
    // Clone stats for battle
    const p1 = { ...player1Stats, currentHp: player1Stats.health };
    const p2 = { ...player2Stats, currentHp: player2Stats.health };
    
    runBattle(p1, p2);
  };

  const runBattle = async (p1, p2) => {
    const log = [];
    let turn = 0;
    const maxTurns = 20;
    
    // Determine who goes first based on speed
    let attacker = p1.speed >= p2.speed ? p1 : p2;
    let defender = attacker === p1 ? p2 : p1;
    
    log.push({ type: 'info', text: `⚔️ Battle begins! ${attacker.name} has higher speed and attacks first!` });
    
    while (p1.currentHp > 0 && p2.currentHp > 0 && turn < maxTurns) {
      turn++;
      
      // Calculate damage
      const baseDamage = attacker.attack + Math.floor(Math.random() * 10);
      const defense = defender.defense * 0.5;
      const evasionRoll = Math.random() * 100;
      
      // Check for critical hit
      const critRoll = Math.random();
      const isCrit = critRoll < attacker.critChance;
      
      // Check for evasion
      if (evasionRoll < defender.evasion) {
        log.push({ 
          type: 'miss', 
          attacker: attacker.name,
          text: `${defender.name} evades ${attacker.name}'s attack! 💨` 
        });
      } else {
        let damage = Math.max(1, Math.floor(baseDamage - defense));
        if (isCrit) {
          damage = Math.floor(damage * 1.5);
          log.push({ 
            type: 'crit', 
            attacker: attacker.name,
            damage,
            text: `💥 CRITICAL HIT! ${attacker.name} deals ${damage} damage to ${defender.name}!` 
          });
        } else {
          log.push({ 
            type: 'hit', 
            attacker: attacker.name,
            damage,
            text: `${attacker.name} attacks ${defender.name} for ${damage} damage!` 
          });
        }
        defender.currentHp -= damage;
      }
      
      // Regeneration
      if (attacker.regen > 0 && attacker.currentHp < attacker.health) {
        const healAmount = Math.min(attacker.regen, attacker.health - attacker.currentHp);
        attacker.currentHp += healAmount;
        log.push({ 
          type: 'heal', 
          attacker: attacker.name,
          text: `✨ ${attacker.name} regenerates ${healAmount} HP!` 
        });
      }
      
      // Update UI
      if (attacker === p1) {
        setPlayer1Stats(prev => ({ ...prev, currentHp: p1.currentHp }));
        setPlayer2Stats(prev => ({ ...prev, currentHp: p2.currentHp }));
      } else {
        setPlayer1Stats(prev => ({ ...prev, currentHp: p1.currentHp }));
        setPlayer2Stats(prev => ({ ...prev, currentHp: p2.currentHp }));
      }
      
      setBattleLog([...log]);
      setCurrentTurn(turn);
      
      // Delay for animation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Swap attacker/defender
      [attacker, defender] = [defender, attacker];
    }
    
    // Determine winner
    let battleWinner = null;
    if (p1.currentHp <= 0) {
      battleWinner = p2;
      log.push({ type: 'victory', text: `🏆 ${p2.name} WINS!` });
    } else if (p2.currentHp <= 0) {
      battleWinner = p1;
      log.push({ type: 'victory', text: `🏆 ${p1.name} WINS!` });
    } else {
      // Draw by turn limit - whoever has more HP wins
      battleWinner = p1.currentHp >= p2.currentHp ? p1 : p2;
      log.push({ type: 'victory', text: `⏱️ Time limit! ${battleWinner.name} wins with more HP!` });
    }
    
    setWinner(battleWinner);
    setBattleLog(log);
    setBattleState('finished');
    
    // Save battle record
    await base44.entities.BattleRecord.create({
      player1_id: player1Id,
      player2_id: player2Id,
      player1_name: player1Stats.name,
      player2_name: player2Stats.name,
      winner_id: battleWinner === p1 ? player1Id : player2Id,
      winner_name: battleWinner.name,
      player1_stats: JSON.stringify(player1Stats),
      player2_stats: JSON.stringify(player2Stats),
      battle_log: JSON.stringify(log),
      total_turns: turn,
      battle_date: new Date().toISOString().split('T')[0]
    });
  };

  const resetBattle = () => {
    setBattleState('select');
    setPlayer1Stats(null);
    setPlayer2Stats(null);
    setBattleLog([]);
    setWinner(null);
    setCurrentTurn(0);
  };

  const StatBar = ({ label, value, max, color, icon: Icon }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="flex items-center gap-1 text-gray-400">
          {Icon && <Icon className="w-3 h-3" />}
          {label}
        </span>
        <span className="text-white">{value}</span>
      </div>
      <Progress value={(value / max) * 100} className={`h-2 ${color}`} />
    </div>
  );

  const PlayerCard = ({ stats, member, isLeft }) => {
    if (!stats) return null;
    
    const hpPercent = stats.currentHp !== undefined 
      ? (stats.currentHp / stats.health) * 100 
      : 100;
    
    return (
      <Card className={`bg-gradient-to-br ${isLeft ? 'from-blue-900/50 to-purple-900/50' : 'from-red-900/50 to-orange-900/50'} border-white/20 flex-1`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg flex items-center justify-between">
            <span>{stats.name}</span>
            <NumberBadge number={member?.life_path_western} size="sm" />
          </CardTitle>
          <p className="text-xs text-gray-400">{member?.sun_sign} • LP {member?.life_path_western}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* HP Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-red-400 flex items-center gap-1">
                <Heart className="w-4 h-4" /> HP
              </span>
              <span className="text-white font-bold">
                {stats.currentHp !== undefined ? Math.max(0, Math.floor(stats.currentHp)) : stats.health} / {stats.health}
              </span>
            </div>
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  hpPercent > 50 ? 'bg-green-500' : hpPercent > 25 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.max(0, hpPercent)}%` }}
              />
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-white/5 rounded flex justify-between">
              <span className="text-gray-400 flex items-center gap-1"><Swords className="w-3 h-3" /> ATK</span>
              <span className="text-orange-400 font-bold">{stats.attack}</span>
            </div>
            <div className="p-2 bg-white/5 rounded flex justify-between">
              <span className="text-gray-400 flex items-center gap-1"><Shield className="w-3 h-3" /> DEF</span>
              <span className="text-blue-400 font-bold">{stats.defense}</span>
            </div>
            <div className="p-2 bg-white/5 rounded flex justify-between">
              <span className="text-gray-400 flex items-center gap-1"><Wind className="w-3 h-3" /> SPD</span>
              <span className="text-green-400 font-bold">{stats.speed}</span>
            </div>
            <div className="p-2 bg-white/5 rounded flex justify-between">
              <span className="text-gray-400 flex items-center gap-1"><Zap className="w-3 h-3" /> EVA</span>
              <span className="text-purple-400 font-bold">{stats.evasion}%</span>
            </div>
          </div>
          
          {/* Special Abilities */}
          {stats.abilities && stats.abilities.length > 0 && (
            <div className="pt-2 border-t border-white/10">
              <p className="text-xs text-gray-400 mb-1">Abilities</p>
              <div className="flex flex-wrap gap-1">
                {stats.abilities.map((ability, i) => (
                  <span key={i} className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-xs">
                    {ability}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (checkingAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-md">
          <CardContent className="py-12 text-center">
            <Swords className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Battle Disabled</h2>
            <p className="text-gray-300">This game has been disabled by your family admin.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Swords className="w-10 h-10 text-amber-400" />
            Numerology Battle
          </h1>
          <p className="text-gray-300">Battle with stats derived from numerology!</p>
        </div>

        {/* Character Selection */}
        {battleState === 'select' && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Choose Your Fighters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Player 1</label>
                  <Select value={player1Id} onValueChange={setPlayer1Id}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select fighter" />
                    </SelectTrigger>
                    <SelectContent>
                      {familyMembers.map(m => (
                        <SelectItem key={m.id} value={m.id} disabled={m.id === player2Id}>
                          {m.nickname || m.full_name} (LP: {m.life_path_western})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Player 2</label>
                  <Select value={player2Id} onValueChange={setPlayer2Id}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select fighter" />
                    </SelectTrigger>
                    <SelectContent>
                      {familyMembers.map(m => (
                        <SelectItem key={m.id} value={m.id} disabled={m.id === player1Id}>
                          {m.nickname || m.full_name} (LP: {m.life_path_western})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                onClick={loadBattleStats} 
                disabled={!player1Id || !player2Id || isLoading}
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Calculating Stats...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> Load Battle Stats</>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Battle Arena */}
        {(battleState === 'ready' || battleState === 'fighting' || battleState === 'finished') && (
          <>
            {/* Player Cards */}
            <div className="flex gap-4 mb-6">
              <PlayerCard 
                stats={player1Stats} 
                member={familyMembers.find(m => m.id === player1Id)}
                isLeft={true}
              />
              <div className="flex items-center">
                <span className="text-4xl font-bold text-amber-400">VS</span>
              </div>
              <PlayerCard 
                stats={player2Stats} 
                member={familyMembers.find(m => m.id === player2Id)}
                isLeft={false}
              />
            </div>

            {/* Battle Controls */}
            <div className="flex justify-center gap-4 mb-6">
              {battleState === 'ready' && (
                <Button onClick={startBattle} className="bg-red-600 hover:bg-red-700 text-xl px-8 py-6">
                  <Swords className="w-6 h-6 mr-2" /> START BATTLE!
                </Button>
              )}
              {battleState === 'fighting' && (
                <div className="text-white text-xl flex items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                  Turn {currentTurn}...
                </div>
              )}
              {battleState === 'finished' && (
                <Button onClick={resetBattle} className="bg-amber-600 hover:bg-amber-700">
                  <RotateCcw className="w-4 h-4 mr-2" /> New Battle
                </Button>
              )}
            </div>

            {/* Winner Display */}
            {winner && (
              <Card className="bg-gradient-to-r from-amber-600/30 to-yellow-600/30 border-amber-500/50 mb-6">
                <CardContent className="py-6 text-center">
                  <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-2">{winner.name} Wins!</h2>
                  <p className="text-gray-300">Victory achieved in {currentTurn} turns</p>
                </CardContent>
              </Card>
            )}

            {/* Battle Log */}
            {battleLog.length > 0 && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Battle Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 overflow-y-auto space-y-2 font-mono text-sm">
                    {battleLog.map((entry, i) => (
                      <div 
                        key={i} 
                        className={`p-2 rounded ${
                          entry.type === 'victory' ? 'bg-amber-500/20 text-amber-300 font-bold' :
                          entry.type === 'crit' ? 'bg-red-500/20 text-red-300' :
                          entry.type === 'miss' ? 'bg-gray-500/20 text-gray-400' :
                          entry.type === 'heal' ? 'bg-green-500/20 text-green-300' :
                          entry.type === 'info' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-white/5 text-gray-300'
                        }`}
                      >
                        {entry.text}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}