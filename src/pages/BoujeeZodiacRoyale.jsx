import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Sparkles, Crown, Swords, Shield, Zap, Heart, Info, X } from 'lucide-react';

// Western Zodiac Signs with dates and powers
const ZODIAC_SIGNS = {
  aries: { name: 'Aries', emoji: '♈', element: 'Fire', dates: [[3, 21], [4, 19]], power: 'Warrior Fury', statBonus: { attack: 15 }, gradient: 'from-red-600 to-orange-500' },
  taurus: { name: 'Taurus', emoji: '♉', element: 'Earth', dates: [[4, 20], [5, 20]], power: 'Earthen Shield', statBonus: { defense: 15 }, gradient: 'from-green-700 to-emerald-600' },
  gemini: { name: 'Gemini', emoji: '♊', element: 'Air', dates: [[5, 21], [6, 20]], power: 'Twin Strike', statBonus: { speed: 15 }, gradient: 'from-yellow-500 to-amber-400' },
  cancer: { name: 'Cancer', emoji: '♋', element: 'Water', dates: [[6, 21], [7, 22]], power: 'Lunar Blessing', statBonus: { magic: 15 }, gradient: 'from-blue-400 to-cyan-300' },
  leo: { name: 'Leo', emoji: '♌', element: 'Fire', dates: [[7, 23], [8, 22]], power: 'Lion\'s Roar', statBonus: { attack: 12, magic: 8 }, gradient: 'from-yellow-600 to-orange-500' },
  virgo: { name: 'Virgo', emoji: '♍', element: 'Earth', dates: [[8, 23], [9, 22]], power: 'Perfect Precision', statBonus: { defense: 10, speed: 10 }, gradient: 'from-green-600 to-teal-500' },
  libra: { name: 'Libra', emoji: '♎', element: 'Air', dates: [[9, 23], [10, 22]], power: 'Scales of Justice', statBonus: { magic: 12, defense: 8 }, gradient: 'from-pink-500 to-rose-400' },
  scorpio: { name: 'Scorpio', emoji: '♏', element: 'Water', dates: [[10, 23], [11, 21]], power: 'Venomous Strike', statBonus: { attack: 10, magic: 10 }, gradient: 'from-purple-800 to-red-700' },
  sagittarius: { name: 'Sagittarius', emoji: '♐', element: 'Fire', dates: [[11, 22], [12, 21]], power: 'Arrow of Truth', statBonus: { speed: 12, attack: 8 }, gradient: 'from-purple-600 to-indigo-500' },
  capricorn: { name: 'Capricorn', emoji: '♑', element: 'Earth', dates: [[12, 22], [1, 19]], power: 'Mountain Endurance', statBonus: { defense: 12, magic: 8 }, gradient: 'from-gray-700 to-slate-600' },
  aquarius: { name: 'Aquarius', emoji: '♒', element: 'Air', dates: [[1, 20], [2, 18]], power: 'Electric Mind', statBonus: { magic: 15 }, gradient: 'from-cyan-600 to-blue-500' },
  pisces: { name: 'Pisces', emoji: '♓', element: 'Water', dates: [[2, 19], [3, 20]], power: 'Mystic Dreams', statBonus: { magic: 12, speed: 8 }, gradient: 'from-blue-500 to-purple-500' }
};

// Chinese Zodiac Animals
const CHINESE_ANIMALS = [
  { name: 'Rat', emoji: '🐀', trait: 'Cunning', bonus: { speed: 10 } },
  { name: 'Ox', emoji: '🐂', trait: 'Strength', bonus: { defense: 10 } },
  { name: 'Tiger', emoji: '🐅', trait: 'Courage', bonus: { attack: 10 } },
  { name: 'Rabbit', emoji: '🐇', trait: 'Agility', bonus: { speed: 10 } },
  { name: 'Dragon', emoji: '🐉', trait: 'Power', bonus: { magic: 15 } },
  { name: 'Snake', emoji: '🐍', trait: 'Wisdom', bonus: { magic: 10 } },
  { name: 'Horse', emoji: '🐴', trait: 'Freedom', bonus: { speed: 10 } },
  { name: 'Goat', emoji: '🐐', trait: 'Gentleness', bonus: { defense: 8, magic: 7 } },
  { name: 'Monkey', emoji: '🐵', trait: 'Cleverness', bonus: { speed: 8, attack: 7 } },
  { name: 'Rooster', emoji: '🐓', trait: 'Confidence', bonus: { attack: 10 } },
  { name: 'Dog', emoji: '🐕', trait: 'Loyalty', bonus: { defense: 10 } },
  { name: 'Pig', emoji: '🐖', trait: 'Generosity', bonus: { defense: 8, magic: 7 } }
];

// Chinese Elements (60-year cycle)
const CHINESE_ELEMENTS = [
  { name: 'Wood', emoji: '🌳', effect: 'Growth Power', bonus: { magic: 8 } },
  { name: 'Fire', emoji: '🔥', effect: 'Passion Boost', bonus: { attack: 8 } },
  { name: 'Earth', emoji: '🏔️', effect: 'Stability', bonus: { defense: 8 } },
  { name: 'Metal', emoji: '⚔️', effect: 'Sharp Force', bonus: { attack: 5, defense: 5 } },
  { name: 'Water', emoji: '💧', effect: 'Flow Mastery', bonus: { speed: 8 } }
];

// Epic artifacts for quest stories
const ARTIFACTS = [
  'Dragon Scale of Power', 'Phoenix Feather of Rebirth', 'Unicorn Horn of Purity',
  'Serpent Eye of Wisdom', 'Wolf Fang of Courage', 'Eagle Talon of Vision',
  'Lion Heart of Bravery', 'Bear Claw of Strength', 'Dolphin Pearl of Intelligence',
  'Tiger Stripe of Ferocity', 'Owl Wisdom Stone', 'Raven Shadow Cloak'
];

// Quest story templates
const QUEST_TEMPLATES = {
  champion: [
    'ventured into the mystical realm of {element} and claimed the legendary {artifact}',
    'defeated the ancient guardian of the {zodiac} temple and earned the title of {title}',
    'mastered the secret technique of {power} after years of training in the {element} mountains',
    'united the warring clans of the {animal} kingdom and became their supreme leader'
  ],
  hero: [
    'proved their worth by overcoming the trials of the {zodiac} sanctuary',
    'discovered the hidden path to the {element} shrine and unlocked their true potential',
    'saved the village from the rampaging {animal} and became a local legend',
    'completed the sacred quest for the {artifact} and returned victorious'
  ],
  warrior: [
    'trained under the masters of {power} and honed their combat skills',
    'journeyed through the dangerous {element} wastelands seeking enlightenment',
    'defended the innocent from the dark forces threatening the {zodiac} realm',
    'gathered allies from across the land to form an unstoppable team'
  ],
  seeker: [
    'began their epic journey to master the ways of {power}',
    'set out to prove themselves worthy of the {artifact}',
    'sought wisdom from the ancient {animal} spirits',
    'trained in the art of {element} manipulation to grow stronger'
  ]
};

export default function BoujeeZodiacRoyale() {
  const [players, setPlayers] = useState([{ name: '', birthDate: '' }]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Calculate Western Zodiac Sign
  const getZodiacSign = (month, day) => {
    for (const [key, sign] of Object.entries(ZODIAC_SIGNS)) {
      const [[startMonth, startDay], [endMonth, endDay]] = sign.dates;
      // Handle year-spanning signs (like Capricorn: Dec 22 - Jan 19)
      if (startMonth > endMonth) {
        // Year-spanning: check if in late year (>= start) OR early year (<= end)
        const inLateYear = (month === startMonth && day >= startDay) || (month > startMonth);
        const inEarlyYear = (month === endMonth && day <= endDay) || (month < endMonth);
        if (inLateYear || inEarlyYear) {
          return { key, ...sign };
        }
      } else {
        // Normal range: within same year
        if ((month === startMonth && day >= startDay) || 
            (month === endMonth && day <= endDay) ||
            (month > startMonth && month < endMonth)) {
          return { key, ...sign };
        }
      }
    }
    return { key: 'aries', ...ZODIAC_SIGNS.aries };
  };

  // Calculate Chinese Zodiac Animal and Element
  const getChineseZodiac = (year) => {
    // Chinese zodiac starts with Rat in 1900 (Year of the Rat)
    // Note: This uses Western calendar year for simplicity in the game.
    // Traditional Chinese zodiac uses lunar calendar and Chinese New Year dates.
    const baseYear = 1900;
    const animalIndex = (year - baseYear) % 12;
    // Elements follow a 2-year cycle within the 60-year cycle
    // Each element lasts 2 years: Wood(0-1), Fire(2-3), Earth(4-5), Metal(6-7), Water(8-9)
    const elementIndex = Math.floor(((year - baseYear) % 10) / 2);
    
    return {
      animal: CHINESE_ANIMALS[animalIndex],
      element: CHINESE_ELEMENTS[elementIndex]
    };
  };

  // Self-contained numerology calculation with master number detection
  const calculateNumerology = (name, birthDate) => {
    const nameValue = (str) => {
      const values = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9, s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8 };
      return str.toLowerCase().split('').reduce((sum, char) => {
        return sum + (values[char] || 0);
      }, 0);
    };

    const reduceToSingle = (num, checkMaster = true) => {
      if (checkMaster && (num === 11 || num === 22 || num === 33)) return num;
      while (num > 9) {
        num = num.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
        if (checkMaster && (num === 11 || num === 22 || num === 33)) return num;
      }
      return num;
    };

    // Expression number (full name)
    const expression = reduceToSingle(nameValue(name.replace(/[^a-zA-Z]/g, '')));

    // Life path from birth date - add all digits first, then reduce
    const [year, month, day] = birthDate.split('-').map(n => parseInt(n));
    const dateSum = year + month + day;
    const lifePath = reduceToSingle(dateSum);

    // Soul urge (vowels)
    const vowels = name.replace(/[^aeiouAEIOU]/g, '');
    const soulUrge = reduceToSingle(nameValue(vowels));

    return { expression, lifePath, soulUrge };
  };

  // Calculate battle stats with zodiac modifiers
  const calculateBattleStats = (playerData) => {
    const { name, birthDate } = playerData;
    const [year, month, day] = birthDate.split('-').map(n => parseInt(n));

    // Get zodiac signs
    const westernZodiac = getZodiacSign(month, day);
    const chineseZodiac = getChineseZodiac(year);

    // Get numerology
    const numerology = calculateNumerology(name, birthDate);

    // Base stats from numerology
    let attack = 50 + (numerology.expression * 5);
    let defense = 50 + (numerology.lifePath * 5);
    let speed = 50 + (numerology.soulUrge * 5);
    let magic = 50 + ((numerology.expression + numerology.soulUrge) * 2.5);

    // Apply Western zodiac bonuses
    const zodiacBonus = westernZodiac.statBonus;
    attack += zodiacBonus.attack || 0;
    defense += zodiacBonus.defense || 0;
    speed += zodiacBonus.speed || 0;
    magic += zodiacBonus.magic || 0;

    // Apply Chinese animal bonuses
    const animalBonus = chineseZodiac.animal.bonus;
    attack += animalBonus.attack || 0;
    defense += animalBonus.defense || 0;
    speed += animalBonus.speed || 0;
    magic += animalBonus.magic || 0;

    // Apply Chinese element bonuses
    const elementBonus = chineseZodiac.element.bonus;
    attack += elementBonus.attack || 0;
    defense += elementBonus.defense || 0;
    speed += elementBonus.speed || 0;
    magic += elementBonus.magic || 0;

    // Master number bonuses
    const masterNumbers = [numerology.expression, numerology.lifePath, numerology.soulUrge].filter(n => n === 11 || n === 22 || n === 33);
    const masterBonus = masterNumbers.length * 10;

    // Calculate total power score
    const totalPower = attack + defense + speed + magic + (masterNumbers.length * 50);

    return {
      name,
      westernZodiac,
      chineseZodiac,
      numerology,
      stats: {
        attack: Math.round(attack),
        defense: Math.round(defense),
        speed: Math.round(speed),
        magic: Math.round(magic)
      },
      masterNumbers,
      masterBonus,
      totalPower: Math.round(totalPower)
    };
  };

  // Generate epic quest story
  const generateQuestStory = (character, rank) => {
    const templates = rank === 1 ? QUEST_TEMPLATES.champion :
                     rank <= 3 ? QUEST_TEMPLATES.hero :
                     rank <= 6 ? QUEST_TEMPLATES.warrior :
                     QUEST_TEMPLATES.seeker;

    const template = templates[Math.floor(Math.random() * templates.length)];
    const artifact = ARTIFACTS[Math.floor(Math.random() * ARTIFACTS.length)];
    
    const titles = ['Divine Champion', 'Master of Elements', 'Zodiac Warrior', 'Celestial Guardian', 'Mystic Sage'];
    const title = titles[Math.floor(Math.random() * titles.length)];

    return template
      .replace('{element}', character.westernZodiac.element)
      .replace('{artifact}', artifact)
      .replace('{zodiac}', character.westernZodiac.name)
      .replace('{title}', title)
      .replace('{power}', character.westernZodiac.power)
      .replace('{animal}', character.chineseZodiac.animal.name);
  };

  // Add player input
  const addPlayer = () => {
    if (players.length < 10) {
      setPlayers([...players, { name: '', birthDate: '' }]);
    }
  };

  // Remove player
  const removePlayer = (index) => {
    if (players.length > 1) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  // Update player data
  const updatePlayer = (index, field, value) => {
    const newPlayers = [...players];
    newPlayers[index][field] = value;
    setPlayers(newPlayers);
  };

  // Start battle
  const startBattle = () => {
    const validPlayers = players.filter(p => p.name && p.birthDate);
    if (validPlayers.length < 2) return;

    setLoading(true);
    
    setTimeout(() => {
      const characters = validPlayers.map(calculateBattleStats);
      const ranked = [...characters].sort((a, b) => b.totalPower - a.totalPower);
      
      const withStories = ranked.map((char, index) => ({
        ...char,
        rank: index + 1,
        questStory: generateQuestStory(char, index + 1)
      }));

      setResults(withStories);
      setLoading(false);
    }, 1500);
  };

  // Reset game
  const reset = () => {
    setPlayers([{ name: '', birthDate: '' }]);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to={createPageUrl('Games')}>
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Games
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGuide(!showGuide)}
            className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
          >
            <Info className="w-4 h-4 mr-2" /> {showGuide ? 'Hide' : 'Show'} Guide
          </Button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-12 h-12 text-yellow-400 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-transparent bg-clip-text">
              Boujee Masters
            </h1>
            <Crown className="w-12 h-12 text-yellow-400 animate-bounce" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Zodiac Royale Epic Battle
          </h2>
          <p className="text-gray-300 text-lg">
            Unleash Your Cosmic Power! 🌟
          </p>
        </div>

        {/* Guide Section */}
        {showGuide && (
          <Card className="bg-white/10 backdrop-blur-sm border-purple-500/30 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Zodiac Powers Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-purple-300 font-bold mb-2">🌟 Western Zodiac Elements</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div className="bg-red-500/20 p-2 rounded">🔥 Fire: Attack Boost</div>
                  <div className="bg-green-500/20 p-2 rounded">🏔️ Earth: Defense Boost</div>
                  <div className="bg-blue-500/20 p-2 rounded">💨 Air: Speed Boost</div>
                  <div className="bg-cyan-500/20 p-2 rounded">💧 Water: Magic Boost</div>
                </div>
              </div>
              <div>
                <h3 className="text-purple-300 font-bold mb-2">🐉 Chinese Elements</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                  <div className="bg-green-600/20 p-2 rounded">🌳 Wood: Magic +8</div>
                  <div className="bg-red-600/20 p-2 rounded">🔥 Fire: Attack +8</div>
                  <div className="bg-yellow-700/20 p-2 rounded">🏔️ Earth: Defense +8</div>
                  <div className="bg-gray-600/20 p-2 rounded">⚔️ Metal: Balanced +5/+5</div>
                  <div className="bg-blue-600/20 p-2 rounded">💧 Water: Speed +8</div>
                </div>
              </div>
              <div>
                <h3 className="text-purple-300 font-bold mb-2">✨ Master Numbers</h3>
                <p className="text-gray-300 text-sm">11, 22, 33 give massive bonuses! Each master number adds +10 to all stats and +50 to total power!</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!results ? (
          /* Player Input Section */
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Enter Warriors ({players.length}/10)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {players.map((player, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Name"
                      value={player.name}
                      onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                    <Input
                      type="date"
                      value={player.birthDate}
                      onChange={(e) => updatePlayer(index, 'birthDate', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  {players.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePlayer(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <div className="flex gap-3">
                <Button
                  onClick={addPlayer}
                  disabled={players.length >= 10}
                  variant="outline"
                  className="flex-1 border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                >
                  Add Warrior ({players.length}/10)
                </Button>
                <Button
                  onClick={startBattle}
                  disabled={players.filter(p => p.name && p.birthDate).length < 2 || loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {loading ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Calculating Powers...
                    </>
                  ) : (
                    <>
                      <Swords className="w-4 h-4 mr-2" />
                      Start Epic Battle!
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Results Section */
          <div className="space-y-6">
            {/* Champion Announcement */}
            <Card className="bg-gradient-to-r from-yellow-600/30 via-amber-600/30 to-orange-600/30 border-yellow-500/50">
              <CardContent className="py-8 text-center">
                <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-bounce" />
                <h2 className="text-4xl font-bold text-white mb-2">
                  {results[0].name} Reigns Supreme!
                </h2>
                <p className="text-xl text-yellow-200">
                  Total Power: {results[0].totalPower} 🌟
                </p>
                {results[0].masterNumbers.length > 0 && (
                  <p className="text-lg text-amber-300 mt-2">
                    ✨ Master Numbers: {results[0].masterNumbers.join(', ')} ✨
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Character Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {results.map((character) => (
                <Card 
                  key={character.rank} 
                  className={`bg-gradient-to-br ${character.westernZodiac.gradient} bg-opacity-20 backdrop-blur-sm border-white/30 ${character.rank === 1 ? 'ring-4 ring-yellow-400' : ''}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-2xl flex items-center gap-2">
                        {character.rank === 1 && <Crown className="w-6 h-6 text-yellow-400" />}
                        #{character.rank} {character.name}
                      </CardTitle>
                      <div className="text-3xl">{character.westernZodiac.emoji}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Zodiac Info */}
                    <div className="bg-white/10 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">Western Zodiac:</span>
                        <span className="text-white font-bold">{character.westernZodiac.emoji} {character.westernZodiac.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">Power:</span>
                        <span className="text-purple-300">{character.westernZodiac.power}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">Chinese Animal:</span>
                        <span className="text-white font-bold">{character.chineseZodiac.animal.emoji} {character.chineseZodiac.animal.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">Element:</span>
                        <span className="text-white font-bold">{character.chineseZodiac.element.emoji} {character.chineseZodiac.element.name}</span>
                      </div>
                    </div>

                    {/* Numerology */}
                    <div className="bg-white/10 rounded-lg p-3">
                      <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        Numerology
                      </h4>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center">
                          <div className="text-gray-300">Life Path</div>
                          <div className={`text-lg font-bold ${[11, 22, 33].includes(character.numerology.lifePath) ? 'text-yellow-400' : 'text-white'}`}>
                            {character.numerology.lifePath}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-300">Expression</div>
                          <div className={`text-lg font-bold ${[11, 22, 33].includes(character.numerology.expression) ? 'text-yellow-400' : 'text-white'}`}>
                            {character.numerology.expression}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-300">Soul Urge</div>
                          <div className={`text-lg font-bold ${[11, 22, 33].includes(character.numerology.soulUrge) ? 'text-yellow-400' : 'text-white'}`}>
                            {character.numerology.soulUrge}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Battle Stats */}
                    <div className="bg-white/10 rounded-lg p-3">
                      <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                        <Swords className="w-4 h-4 text-red-400" />
                        Battle Stats
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 flex items-center gap-1 text-sm">
                            <Swords className="w-3 h-3 text-red-400" /> Attack
                          </span>
                          <span className="text-white font-bold">{character.stats.attack}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 flex items-center gap-1 text-sm">
                            <Shield className="w-3 h-3 text-blue-400" /> Defense
                          </span>
                          <span className="text-white font-bold">{character.stats.defense}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 flex items-center gap-1 text-sm">
                            <Zap className="w-3 h-3 text-yellow-400" /> Speed
                          </span>
                          <span className="text-white font-bold">{character.stats.speed}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 flex items-center gap-1 text-sm">
                            <Heart className="w-3 h-3 text-purple-400" /> Magic
                          </span>
                          <span className="text-white font-bold">{character.stats.magic}</span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-white/20 flex items-center justify-between">
                          <span className="text-yellow-300 font-bold text-sm">Total Power</span>
                          <span className="text-yellow-400 font-bold text-xl">{character.totalPower}</span>
                        </div>
                      </div>
                    </div>

                    {/* Epic Quest Story */}
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-3 border border-purple-500/30">
                      <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                        📜 Epic Quest
                      </h4>
                      <p className="text-gray-200 text-sm italic leading-relaxed">
                        {character.name} {character.questStory}.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Reset Button */}
            <div className="text-center">
              <Button
                onClick={reset}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                New Battle
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
