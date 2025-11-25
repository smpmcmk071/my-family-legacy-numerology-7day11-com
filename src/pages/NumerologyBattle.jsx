import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { base44 } from '@/api/base44Client';
import { Swords, Zap, Shield, Heart, Wind, Sparkles, Trophy, RotateCcw, Loader2, History, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import NumberBadge from '../components/legacy/NumberBadge';
import TeamSelector from '../components/battle/TeamSelector';
import TeamCard from '../components/battle/TeamCard';

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
  const [battleHistory, setBattleHistory] = useState([]);
  const [battleSummary, setBattleSummary] = useState(null);
  
  // Team battle state
  const [battleMode, setBattleMode] = useState('1v1'); // 1v1, 2v2, 3v3
  const [team1Ids, setTeam1Ids] = useState([]);
  const [team2Ids, setTeam2Ids] = useState([]);
  const [team1Stats, setTeam1Stats] = useState([]);
  const [team2Stats, setTeam2Stats] = useState([]);

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
      
      // Load battle history
      const history = await base44.entities.BattleRecord.list('-created_date', 50);
      setBattleHistory(history);
    }
    setCheckingAccess(false);
  };

  const getTeamSize = () => {
    if (battleMode === '2v2') return 2;
    if (battleMode === '3v3') return 3;
    return 1;
  };

  const toggleTeam1 = (id) => {
    if (team1Ids.includes(id)) {
      setTeam1Ids(team1Ids.filter(i => i !== id));
    } else if (team1Ids.length < getTeamSize()) {
      setTeam1Ids([...team1Ids, id]);
    }
  };

  const toggleTeam2 = (id) => {
    if (team2Ids.includes(id)) {
      setTeam2Ids(team2Ids.filter(i => i !== id));
    } else if (team2Ids.length < getTeamSize()) {
      setTeam2Ids([...team2Ids, id]);
    }
  };

  const loadBattleStats = async () => {
    // 1v1 mode
    if (battleMode === '1v1') {
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
      return;
    }
    
    // Team mode
    if (team1Ids.length !== getTeamSize() || team2Ids.length !== getTeamSize()) return;
    
    setIsLoading(true);
    
    // Load stats for all team members
    const t1Stats = [];
    const t2Stats = [];
    
    for (const id of team1Ids) {
      const response = await base44.functions.invoke('calculateBattleStats', {
        action: 'getPlayerStats',
        playerId: id
      });
      if (response.data?.success) {
        t1Stats.push({
          ...response.data.data.stats,
          id,
          name: response.data.data.name,
          abilities: response.data.data.stats.specialAbilities
        });
      }
    }
    
    for (const id of team2Ids) {
      const response = await base44.functions.invoke('calculateBattleStats', {
        action: 'getPlayerStats',
        playerId: id
      });
      if (response.data?.success) {
        t2Stats.push({
          ...response.data.data.stats,
          id,
          name: response.data.data.name,
          abilities: response.data.data.stats.specialAbilities
        });
      }
    }
    
    setTeam1Stats(t1Stats);
    setTeam2Stats(t2Stats);
    setBattleState('ready');
    setIsLoading(false);
  };

  const startBattle = () => {
    setBattleState('fighting');
    setBattleLog([]);
    setCurrentTurn(0);
    
    if (battleMode === '1v1') {
      if (!player1Stats || !player2Stats) return;
      // Clone stats for battle
      const p1 = { ...player1Stats, currentHp: player1Stats.health };
      const p2 = { ...player2Stats, currentHp: player2Stats.health };
      runBattle(p1, p2);
    } else {
      // Team battle
      if (team1Stats.length === 0 || team2Stats.length === 0) return;
      const t1 = team1Stats.map(s => ({ ...s, currentHp: s.health }));
      const t2 = team2Stats.map(s => ({ ...s, currentHp: s.health }));
      runTeamBattle(t1, t2);
    }
  };

  const runTeamBattle = async (team1, team2) => {
    const log = [];
    let turn = 0;
    const maxTurns = 30;
    
    // Create combined turn order based on speed
    const allFighters = [
      ...team1.map(f => ({ ...f, team: 1 })),
      ...team2.map(f => ({ ...f, team: 2 }))
    ].sort((a, b) => b.speed - a.speed);
    
    log.push({ type: 'info', text: `⚔️ Team Battle begins! ${team1.map(f => f.name).join(' & ')} VS ${team2.map(f => f.name).join(' & ')}` });
    
    // Log abilities
    team1.forEach(f => {
      if (f.abilities?.length > 0) {
        log.push({ type: 'ability', text: `✨ ${f.name} activates: ${f.abilities.slice(0, 2).join(', ')}${f.abilities.length > 2 ? '...' : ''}` });
      }
    });
    team2.forEach(f => {
      if (f.abilities?.length > 0) {
        log.push({ type: 'ability', text: `✨ ${f.name} activates: ${f.abilities.slice(0, 2).join(', ')}${f.abilities.length > 2 ? '...' : ''}` });
      }
    });
    
    const getAliveEnemies = (attackerTeam) => {
      return attackerTeam === 1 
        ? team2.filter(f => f.currentHp > 0)
        : team1.filter(f => f.currentHp > 0);
    };
    
    const isTeamDefeated = (team) => team.every(f => f.currentHp <= 0);
    
    while (!isTeamDefeated(team1) && !isTeamDefeated(team2) && turn < maxTurns) {
      turn++;
      
      for (const fighter of allFighters) {
        // Skip if fighter is defeated
        if (fighter.currentHp <= 0) continue;
        
        // Get actual fighter reference
        const actualFighter = fighter.team === 1 
          ? team1.find(f => f.id === fighter.id)
          : team2.find(f => f.id === fighter.id);
        
        if (!actualFighter || actualFighter.currentHp <= 0) continue;
        
        // Get alive enemies
        const enemies = getAliveEnemies(fighter.team);
        if (enemies.length === 0) break;
        
        // Pick random target
        const target = enemies[Math.floor(Math.random() * enemies.length)];
        
        // Calculate damage
        const baseDamage = actualFighter.attack + Math.floor(Math.random() * 10);
        const defense = target.defense * 0.5;
        const evasionRoll = Math.random() * 100;
        const critRoll = Math.random();
        const isCrit = critRoll < actualFighter.critChance;
        
        if (evasionRoll < target.evasion) {
          log.push({ 
            type: 'miss', 
            text: `${target.name} evades ${actualFighter.name}'s attack! 💨` 
          });
        } else {
          let damage = Math.max(1, Math.floor(baseDamage - defense));
          if (isCrit) {
            damage = Math.floor(damage * 1.5);
            log.push({ 
              type: 'crit', 
              text: `💥 CRITICAL! ${actualFighter.name} deals ${damage} to ${target.name}!` 
            });
          } else {
            log.push({ 
              type: 'hit', 
              text: `${actualFighter.name} attacks ${target.name} for ${damage} damage!` 
            });
          }
          target.currentHp -= damage;
          
          if (target.currentHp <= 0) {
            target.currentHp = 0;
            log.push({ type: 'defeat', text: `💀 ${target.name} has been defeated!` });
          }
        }
        
        // Regeneration
        if (actualFighter.regen > 0 && actualFighter.currentHp < actualFighter.health) {
          const healAmount = Math.min(actualFighter.regen, actualFighter.health - actualFighter.currentHp);
          actualFighter.currentHp += healAmount;
          log.push({ type: 'heal', text: `✨ ${actualFighter.name} regenerates ${healAmount} HP!` });
        }
        
        // Update UI
        setTeam1Stats([...team1]);
        setTeam2Stats([...team2]);
        setBattleLog([...log]);
        
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Check for team defeat
        if (isTeamDefeated(team1) || isTeamDefeated(team2)) break;
      }
      
      setCurrentTurn(turn);
    }
    
    // Determine winner
    let winningTeam = null;
    if (isTeamDefeated(team1)) {
      winningTeam = 2;
      log.push({ type: 'victory', text: `🏆 Team 2 (${team2.map(f => f.name).join(' & ')}) WINS!` });
    } else if (isTeamDefeated(team2)) {
      winningTeam = 1;
      log.push({ type: 'victory', text: `🏆 Team 1 (${team1.map(f => f.name).join(' & ')}) WINS!` });
    } else {
      // Draw by turn limit
      const t1Hp = team1.reduce((sum, f) => sum + Math.max(0, f.currentHp), 0);
      const t2Hp = team2.reduce((sum, f) => sum + Math.max(0, f.currentHp), 0);
      winningTeam = t1Hp >= t2Hp ? 1 : 2;
      log.push({ type: 'victory', text: `⏱️ Time! Team ${winningTeam} wins with more HP!` });
    }
    
    setWinner({ team: winningTeam, names: winningTeam === 1 ? team1.map(f => f.name) : team2.map(f => f.name) });
    setBattleLog(log);
    setBattleState('finished');
    
    setBattleSummary({
      isTeamBattle: true,
      winningTeam,
      turns: turn,
      team1Final: team1.map(f => ({ name: f.name, hp: Math.max(0, Math.floor(f.currentHp)), maxHp: f.health })),
      team2Final: team2.map(f => ({ name: f.name, hp: Math.max(0, Math.floor(f.currentHp)), maxHp: f.health }))
    });
  };

  const runBattle = async (p1, p2) => {
    const log = [];
    let turn = 0;
    const maxTurns = 20;
    
    // Track ability activations
    const abilityActivations = { [p1.name]: [], [p2.name]: [] };
    
    // Determine who goes first based on speed
    let attacker = p1.speed >= p2.speed ? p1 : p2;
    let defender = attacker === p1 ? p2 : p1;
    
    log.push({ type: 'info', text: `⚔️ Battle begins! ${attacker.name} has higher speed and attacks first!` });
    
    // Log special abilities at start
    if (p1.abilities?.length > 0) {
      log.push({ type: 'ability', text: `✨ ${p1.name} activates: ${p1.abilities.join(', ')}` });
    }
    if (p2.abilities?.length > 0) {
      log.push({ type: 'ability', text: `✨ ${p2.name} activates: ${p2.abilities.join(', ')}` });
    }
    
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
        // Find evasion-related ability
        const evasionAbility = defender.abilities?.find(a => 
          a.includes('Evasion') || a.includes('Wind') || a.includes('55') || a.includes('Seeker') || a.includes('Deep')
        );
        if (evasionAbility && !abilityActivations[defender.name].includes(evasionAbility)) {
          abilityActivations[defender.name].push(evasionAbility);
          log.push({ type: 'ability', text: `🌀 ${defender.name}'s ${evasionAbility} triggers!` });
        }
        log.push({ 
          type: 'miss', 
          attacker: attacker.name,
          text: `${defender.name} evades ${attacker.name}'s attack! 💨` 
        });
      } else {
        let damage = Math.max(1, Math.floor(baseDamage - defense));
        if (isCrit) {
          damage = Math.floor(damage * 1.5);
          // Find crit-related ability
          const critAbility = attacker.abilities?.find(a => 
            a.includes('Strike') || a.includes('Vision') || a.includes('Insight') || a.includes('11') || a.includes('Power')
          );
          if (critAbility && !abilityActivations[attacker.name].includes(critAbility)) {
            abilityActivations[attacker.name].push(critAbility);
            log.push({ type: 'ability', text: `⚡ ${attacker.name}'s ${critAbility} triggers!` });
          }
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
        
        // Check if defender is defeated - end battle immediately
        if (defender.currentHp <= 0) {
          defender.currentHp = 0;
          setPlayer1Stats(prev => ({ ...prev, currentHp: p1.currentHp }));
          setPlayer2Stats(prev => ({ ...prev, currentHp: p2.currentHp }));
          setBattleLog([...log]);
          setCurrentTurn(turn);
          await new Promise(resolve => setTimeout(resolve, 800));
          break;
        }
      }
      
      // Regeneration (only if attacker was damaged)
      if (attacker.regen > 0 && attacker.currentHp < attacker.health) {
        const healAmount = Math.min(attacker.regen, attacker.health - attacker.currentHp);
        attacker.currentHp += healAmount;
        // Find regen-related ability
        const regenAbility = attacker.abilities?.find(a => 
          a.includes('Heal') || a.includes('Aura') || a.includes('33') || a.includes('Nurturer') || a.includes('Regen') || a.includes('Divine')
        );
        if (regenAbility && !abilityActivations[attacker.name].includes(regenAbility)) {
          abilityActivations[attacker.name].push(regenAbility);
          log.push({ type: 'ability', text: `💚 ${attacker.name}'s ${regenAbility} triggers!` });
        }
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
    
    // Store ability activations for summary
    setBattleSummary({
      winner: battleWinner,
      turns: turn,
      p1FinalHp: Math.max(0, Math.floor(p1.currentHp)),
      p2FinalHp: Math.max(0, Math.floor(p2.currentHp)),
      p1Abilities: p1.abilities || [],
      p2Abilities: p2.abilities || [],
      p1Activated: abilityActivations[p1.name] || [],
      p2Activated: abilityActivations[p2.name] || []
    });
    
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
    
    // Refresh battle history
    const history = await base44.entities.BattleRecord.list('-created_date', 50);
    setBattleHistory(history);
  };

  const rematch = () => {
    // Reset battle state but keep players and stats
    setBattleState('ready');
    setBattleLog([]);
    setWinner(null);
    setCurrentTurn(0);
    setBattleSummary(null);
    
    if (battleMode === '1v1') {
      // Reset HP to full
      setPlayer1Stats(prev => ({ ...prev, currentHp: prev.health }));
      setPlayer2Stats(prev => ({ ...prev, currentHp: prev.health }));
    } else {
      // Reset team HP
      setTeam1Stats(prev => prev.map(f => ({ ...f, currentHp: f.health })));
      setTeam2Stats(prev => prev.map(f => ({ ...f, currentHp: f.health })));
    }
  };

  // Calculate win stats for chart
  const getWinStats = () => {
    const stats = {};
    battleHistory.forEach(record => {
      if (record.winner_name) {
        stats[record.winner_name] = (stats[record.winner_name] || 0) + 1;
      }
    });
    return Object.entries(stats)
      .map(([name, wins]) => ({ name, wins }))
      .sort((a, b) => b.wins - a.wins)
      .slice(0, 8);
  };

  const resetBattle = () => {
    setBattleState('select');
    setPlayer1Stats(null);
    setPlayer2Stats(null);
    setTeam1Stats([]);
    setTeam2Stats([]);
    setTeam1Ids([]);
    setTeam2Ids([]);
    setBattleLog([]);
    setWinner(null);
    setCurrentTurn(0);
    setBattleSummary(null);
  };

  const handleModeChange = (mode) => {
    setBattleMode(mode);
    setTeam1Ids([]);
    setTeam2Ids([]);
    setPlayer1Id('');
    setPlayer2Id('');
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
              <CardTitle className="text-white flex items-center justify-between">
                <span>Choose Your Fighters</span>
                <Tabs value={battleMode} onValueChange={handleModeChange}>
                  <TabsList className="bg-white/10">
                    <TabsTrigger value="1v1" className="data-[state=active]:bg-amber-600">1v1</TabsTrigger>
                    <TabsTrigger value="2v2" className="data-[state=active]:bg-amber-600">2v2</TabsTrigger>
                    <TabsTrigger value="3v3" className="data-[state=active]:bg-amber-600">3v3</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {battleMode === '1v1' ? (
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
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <TeamSelector
                    teamNumber={1}
                    members={familyMembers}
                    selectedIds={team1Ids}
                    onToggle={toggleTeam1}
                    maxSize={getTeamSize()}
                    otherTeamIds={team2Ids}
                  />
                  <TeamSelector
                    teamNumber={2}
                    members={familyMembers}
                    selectedIds={team2Ids}
                    onToggle={toggleTeam2}
                    maxSize={getTeamSize()}
                    otherTeamIds={team1Ids}
                  />
                </div>
              )}
              <Button 
                onClick={loadBattleStats} 
                disabled={
                  battleMode === '1v1' 
                    ? (!player1Id || !player2Id || isLoading)
                    : (team1Ids.length !== getTeamSize() || team2Ids.length !== getTeamSize() || isLoading)
                }
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
            {/* Player/Team Cards */}
            <div className="flex gap-4 mb-6">
              {battleMode === '1v1' ? (
                <>
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
                </>
              ) : (
                <>
                  <TeamCard
                    team={team1Stats}
                    members={familyMembers}
                    isLeft={true}
                    teamNumber={1}
                  />
                  <div className="flex items-center">
                    <span className="text-4xl font-bold text-amber-400">VS</span>
                  </div>
                  <TeamCard
                    team={team2Stats}
                    members={familyMembers}
                    isLeft={false}
                    teamNumber={2}
                  />
                </>
              )}
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
                <>
                  <Button onClick={rematch} className="bg-green-600 hover:bg-green-700">
                    <Swords className="w-4 h-4 mr-2" /> Rematch
                  </Button>
                  <Button onClick={resetBattle} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <RotateCcw className="w-4 h-4 mr-2" /> New Fighters
                  </Button>
                </>
              )}
            </div>

            {/* Winner Display & Battle Summary */}
            {battleState === 'finished' && battleSummary && (
              <Card className="bg-gradient-to-r from-amber-600/30 to-yellow-600/30 border-amber-500/50 mb-6">
                <CardContent className="py-6">
                  <div className="text-center mb-6">
                    <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {battleSummary.isTeamBattle 
                        ? `Team ${battleSummary.winningTeam} Wins!`
                        : `${winner?.name} Wins!`
                      }
                    </h2>
                    <p className="text-gray-300">Victory achieved in {battleSummary.turns} turns</p>
                  </div>
                  
                  {/* Battle Summary */}
                  <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/20">
                    {battleSummary.isTeamBattle ? (
                      <>
                        {/* Team 1 Summary */}
                        <div className="p-4 bg-blue-900/30 rounded-lg">
                          <h3 className="text-white font-bold mb-2">Team 1 {battleSummary.winningTeam === 1 && '🏆'}</h3>
                          <div className="space-y-2">
                            {battleSummary.team1Final?.map((f, i) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="text-gray-300">{f.name}</span>
                                <span className={f.hp > 0 ? 'text-green-400' : 'text-red-400'}>
                                  {f.hp}/{f.maxHp} HP
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Team 2 Summary */}
                        <div className="p-4 bg-red-900/30 rounded-lg">
                          <h3 className="text-white font-bold mb-2">Team 2 {battleSummary.winningTeam === 2 && '🏆'}</h3>
                          <div className="space-y-2">
                            {battleSummary.team2Final?.map((f, i) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="text-gray-300">{f.name}</span>
                                <span className={f.hp > 0 ? 'text-green-400' : 'text-red-400'}>
                                  {f.hp}/{f.maxHp} HP
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Player 1 Summary */}
                        <div className="p-4 bg-blue-900/30 rounded-lg">
                          <h3 className="text-white font-bold mb-2">{player1Stats?.name}</h3>
                          <p className="text-sm text-gray-300 mb-2">Final HP: <span className={battleSummary.p1FinalHp > 0 ? 'text-green-400' : 'text-red-400'}>{battleSummary.p1FinalHp}</span> / {player1Stats?.health}</p>
                          {battleSummary.p1Abilities?.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Abilities:</p>
                              <div className="flex flex-wrap gap-1">
                                {battleSummary.p1Abilities.map((a, i) => (
                                  <span key={i} className={`px-2 py-0.5 rounded text-xs ${battleSummary.p1Activated?.includes(a) ? 'bg-green-500/30 text-green-300' : 'bg-gray-500/30 text-gray-400'}`}>
                                    {battleSummary.p1Activated?.includes(a) && '✓ '}{a}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Player 2 Summary */}
                        <div className="p-4 bg-red-900/30 rounded-lg">
                          <h3 className="text-white font-bold mb-2">{player2Stats?.name}</h3>
                          <p className="text-sm text-gray-300 mb-2">Final HP: <span className={battleSummary.p2FinalHp > 0 ? 'text-green-400' : 'text-red-400'}>{battleSummary.p2FinalHp}</span> / {player2Stats?.health}</p>
                          {battleSummary.p2Abilities?.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Abilities:</p>
                              <div className="flex flex-wrap gap-1">
                                {battleSummary.p2Abilities.map((a, i) => (
                                  <span key={i} className={`px-2 py-0.5 rounded text-xs ${battleSummary.p2Activated?.includes(a) ? 'bg-green-500/30 text-green-300' : 'bg-gray-500/30 text-gray-400'}`}>
                                    {battleSummary.p2Activated?.includes(a) && '✓ '}{a}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Battle History Chart */}
            {battleHistory.length > 0 && battleState === 'finished' && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <History className="w-5 h-5" /> Battle Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={getWinStats()} layout="vertical">
                      <XAxis type="number" stroke="#9ca3af" allowDecimals={false} />
                      <YAxis type="category" dataKey="name" stroke="#9ca3af" width={80} tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e1b4b', border: '1px solid #6366f1', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="wins" radius={[0, 4, 4, 0]}>
                        {getWinStats().map((entry, index) => (
                          <Cell key={index} fill={index === 0 ? '#f59e0b' : index === 1 ? '#9ca3af' : index === 2 ? '#b45309' : '#6366f1'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
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
                          entry.type === 'ability' ? 'bg-purple-500/20 text-purple-300' :
                          entry.type === 'info' ? 'bg-blue-500/20 text-blue-300' :
                          entry.type === 'defeat' ? 'bg-red-600/30 text-red-300 font-semibold' :
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