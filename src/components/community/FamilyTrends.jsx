import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Star, Flame, Droplet, Wind, Mountain, AlertTriangle, BookOpen } from 'lucide-react';
import NumberBadge from '@/components/legacy/NumberBadge';

const KARMIC_DEBT_MEANINGS = {
  10: { title: 'Wheel of Fortune', lesson: 'Embrace cycles of change. What goes around comes around - maintain integrity through ups and downs.' },
  12: { title: 'Sacrifice & Surrender', lesson: 'Learn to let go and trust the process. Growth comes through releasing control and serving others.' },
  13: { title: 'Laziness & Shortcuts', lesson: 'Hard work, focus, and building solid foundations. Avoid cutting corners.' },
  14: { title: 'Freedom & Excess', lesson: 'Balance freedom with responsibility. Avoid addiction and overindulgence.' },
  15: { title: 'Materialism & Temptation', lesson: 'Overcome attachment to material pleasures. Find spiritual fulfillment beyond physical desires.' },
  16: { title: 'Ego & Downfall', lesson: 'Humility and spiritual growth. Ego destruction leads to rebirth.' },
  19: { title: 'Independence & Selfishness', lesson: 'Learn to give and receive help. Balance independence with cooperation.' }
};

const KARMIC_LESSON_MEANINGS = {
  1: 'Leadership & Independence - Learn to stand on your own and take initiative',
  2: 'Cooperation & Sensitivity - Develop patience and diplomacy in relationships',
  3: 'Self-Expression & Joy - Embrace creativity and communicate feelings openly',
  4: 'Discipline & Hard Work - Build stability through consistent effort',
  5: 'Freedom & Adaptability - Embrace change and learn from diverse experiences',
  6: 'Responsibility & Love - Nurture others while maintaining healthy boundaries',
  7: 'Faith & Inner Wisdom - Trust intuition and seek deeper spiritual understanding',
  8: 'Power & Abundance - Master material world while staying ethically grounded',
  9: 'Compassion & Release - Let go of attachments and serve humanity selflessly',
  11: 'Spiritual Illumination - Develop intuition and trust your visionary gifts',
  22: 'Master Building - Learn to manifest grand visions into physical reality',
  33: 'Master Teaching - Embrace healing gifts and teach through unconditional love'
};

const ELEMENT_ICONS = {
  Fire: Flame,
  Water: Droplet,
  Air: Wind,
  Earth: Mountain
};

export default function FamilyTrends({ familyMembers }) {
  if (!familyMembers || familyMembers.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="py-12 text-center">
          <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">Add family members to see trends</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate Life Path distribution
  const lifePathCounts = {};
  const expressionCounts = {};
  const elementCounts = {};
  const masterNumberMembers = [];
  const karmicDebtCounts = {};
  const karmicDebtMembers = {};
  const karmicLessonCounts = {};
  const karmicLessonMembers = {};
  
  // Track all unique master numbers per member
  const ALL_MASTER_NUMBERS = [11, 22, 33, 44, 55, 66, 77, 88, 99];
  
  familyMembers.forEach(m => {
    if (m.life_path_western) {
      lifePathCounts[m.life_path_western] = (lifePathCounts[m.life_path_western] || 0) + 1;
    }
    if (m.expression_western) {
      expressionCounts[m.expression_western] = (expressionCounts[m.expression_western] || 0) + 1;
    }
    if (m.element) {
      elementCounts[m.element] = (elementCounts[m.element] || 0) + 1;
    }
    
    // Collect ALL master numbers from this member (life path, expression, soul urge, personality, birthday)
    const memberMasters = new Set();
    
    // Check stored master_numbers field first
    if (m.master_numbers) {
      m.master_numbers.split(',').forEach(n => {
        const num = parseInt(n.trim());
        if (ALL_MASTER_NUMBERS.includes(num)) memberMasters.add(num);
      });
    }
    
    // Check life path (both western and chaldean)
    if (ALL_MASTER_NUMBERS.includes(m.life_path_western)) memberMasters.add(m.life_path_western);
    if (ALL_MASTER_NUMBERS.includes(m.life_path_chaldean)) memberMasters.add(m.life_path_chaldean);
    
    // Check expression (both western and chaldean for higher masters like 77)
    if (ALL_MASTER_NUMBERS.includes(m.expression_western)) memberMasters.add(m.expression_western);
    if (ALL_MASTER_NUMBERS.includes(m.expression_chaldean)) memberMasters.add(m.expression_chaldean);
    
    // Check soul urge
    if (ALL_MASTER_NUMBERS.includes(m.soul_urge_western)) memberMasters.add(m.soul_urge_western);
    if (ALL_MASTER_NUMBERS.includes(m.soul_urge_chaldean)) memberMasters.add(m.soul_urge_chaldean);
    
    // Check personality
    if (ALL_MASTER_NUMBERS.includes(m.personality_western)) memberMasters.add(m.personality_western);
    if (ALL_MASTER_NUMBERS.includes(m.personality_chaldean)) memberMasters.add(m.personality_chaldean);
    
    // Check birthday number (11, 22 only for days)
    if ([11, 22].includes(m.birthday_number)) memberMasters.add(m.birthday_number);
    
    if (memberMasters.size > 0) {
      masterNumberMembers.push({ 
        name: m.nickname || m.full_name?.split(' ')[0], 
        masters: Array.from(memberMasters).sort((a, b) => a - b).join(',')
      });
    }
    // Karmic Debt tracking
    if (m.karmic_debt_number) {
      const debts = m.karmic_debt_number.split(',').map(d => d.trim());
      debts.forEach(debt => {
        if (debt) {
          karmicDebtCounts[debt] = (karmicDebtCounts[debt] || 0) + 1;
          if (!karmicDebtMembers[debt]) karmicDebtMembers[debt] = [];
          karmicDebtMembers[debt].push(m.nickname || m.full_name?.split(' ')[0]);
        }
      });
    }
    // Karmic Lessons tracking
    if (m.karmic_lessons) {
      const lessons = m.karmic_lessons.split(',').map(l => l.trim());
      lessons.forEach(lesson => {
        if (lesson) {
          karmicLessonCounts[lesson] = (karmicLessonCounts[lesson] || 0) + 1;
          if (!karmicLessonMembers[lesson]) karmicLessonMembers[lesson] = [];
          karmicLessonMembers[lesson].push(m.nickname || m.full_name?.split(' ')[0]);
        }
      });
    }
  });

  const sortedKarmicDebts = Object.entries(karmicDebtCounts).sort((a, b) => b[1] - a[1]);
  const sortedKarmicLessons = Object.entries(karmicLessonCounts).sort((a, b) => b[1] - a[1]);

  const sortedLifePaths = Object.entries(lifePathCounts).sort((a, b) => b[1] - a[1]);
  const sortedExpressions = Object.entries(expressionCounts).sort((a, b) => b[1] - a[1]);
  const sortedElements = Object.entries(elementCounts).sort((a, b) => b[1] - a[1]);
  const totalMembers = familyMembers.length;

  return (
    <div className="space-y-4">
      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-2">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="py-3 text-center">
            <Users className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">{totalMembers}</p>
            <p className="text-xs text-gray-400">Members</p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="py-3 text-center">
            <Star className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">{masterNumberMembers.length}</p>
            <p className="text-xs text-gray-400">Masters</p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="py-3 text-center">
            <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">{sortedLifePaths[0]?.[0] || '-'}</p>
            <p className="text-xs text-gray-400">Top LP</p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="py-3 text-center">
            {sortedElements[0] && ELEMENT_ICONS[sortedElements[0][0]] ? (
              React.createElement(ELEMENT_ICONS[sortedElements[0][0]], { className: 'w-5 h-5 text-cyan-400 mx-auto mb-1' })
            ) : (
              <Flame className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            )}
            <p className="text-xl font-bold text-white">{sortedElements[0]?.[0] || '-'}</p>
            <p className="text-xs text-gray-400">Element</p>
          </CardContent>
        </Card>
      </div>

      {/* Life Path & Expression Side by Side */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm">Life Path Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sortedLifePaths.slice(0, 5).map(([num, count]) => {
                const percentage = Math.round((count / totalMembers) * 100);
                return (
                  <div key={num} className="flex items-center gap-2">
                    <NumberBadge number={parseInt(num)} size="sm" />
                    <div className="flex-1">
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-white text-xs w-12 text-right">{count} ({percentage}%)</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm">Expression Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sortedExpressions.slice(0, 5).map(([num, count]) => {
                const percentage = Math.round((count / totalMembers) * 100);
                return (
                  <div key={num} className="flex items-center gap-2">
                    <NumberBadge number={parseInt(num)} size="sm" />
                    <div className="flex-1">
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-white text-xs w-12 text-right">{count} ({percentage}%)</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Element Distribution - Compact */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm">Elemental Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {['Fire', 'Water', 'Air', 'Earth'].map(element => {
              const count = elementCounts[element] || 0;
              const percentage = totalMembers > 0 ? Math.round((count / totalMembers) * 100) : 0;
              const Icon = ELEMENT_ICONS[element];
              const colors = {
                Fire: 'from-red-500 to-orange-500 border-red-500/30',
                Water: 'from-blue-500 to-cyan-500 border-blue-500/30',
                Air: 'from-cyan-400 to-sky-400 border-cyan-500/30',
                Earth: 'from-green-500 to-emerald-500 border-green-500/30'
              };
              
              return (
                <div key={element} className={`p-2 rounded-lg bg-gradient-to-br ${colors[element]} bg-opacity-20 border text-center`}>
                  <Icon className="w-4 h-4 text-white mx-auto mb-1" />
                  <p className="text-white text-xs font-bold">{element}</p>
                  <p className="text-white/80 text-xs">{count} ({percentage}%)</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Master Number Carriers - Compact */}
      {masterNumberMembers.length > 0 && (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              Master Number Carriers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {masterNumberMembers.map((m, i) => (
                <div key={i} className="px-2 py-1 bg-amber-500/20 rounded border border-amber-500/30 flex items-center gap-2">
                  <span className="text-white text-sm">{m.name}</span>
                  <div className="flex gap-0.5">
                    {m.masters.split(',').map((num, j) => (
                      <NumberBadge key={j} number={parseInt(num)} size="sm" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Family Karmic Patterns */}
      {(sortedKarmicDebts.length > 0 || sortedKarmicLessons.length > 0) && (
        <Card className="bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-sm border-red-500/30">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Family Karmic Patterns
            </CardTitle>
            <p className="text-sm text-gray-400 mt-1">
              Karmic patterns that appear across generations reveal lessons your family lineage is working to heal
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Karmic Debts */}
            {sortedKarmicDebts.length > 0 && (
              <div>
                <h4 className="text-red-300 font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Karmic Debts ({sortedKarmicDebts.length} patterns)
                </h4>
                <div className="space-y-3">
                  {sortedKarmicDebts.map(([debt, count]) => {
                    const meaning = KARMIC_DEBT_MEANINGS[parseInt(debt)];
                    return (
                      <div key={debt} className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-red-400">{debt}</span>
                            <span className="text-white font-medium">{meaning?.title || 'Karmic Debt'}</span>
                          </div>
                          <span className="px-2 py-1 bg-red-500/20 rounded text-red-300 text-sm">
                            {count} member{count > 1 ? 's' : ''}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{meaning?.lesson}</p>
                        <div className="flex flex-wrap gap-1">
                          {karmicDebtMembers[debt]?.map((name, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white/10 rounded text-xs text-gray-300">{name}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Karmic Lessons */}
            {sortedKarmicLessons.length > 0 && (
              <div>
                <h4 className="text-orange-300 font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Shared Karmic Lessons (Missing Numbers)
                </h4>
                <p className="text-xs text-gray-400 mb-3">
                  Numbers missing from names indicate soul lessons. When multiple family members share the same missing number, it's a generational pattern.
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  {sortedKarmicLessons.map(([lesson, count]) => {
                    const percentage = Math.round((count / totalMembers) * 100);
                    return (
                      <div key={lesson} className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <NumberBadge number={parseInt(lesson)} size="sm" />
                            <span className="text-orange-300 text-sm font-medium">Missing in {count} members</span>
                          </div>
                          <span className="text-xs text-gray-400">{percentage}%</span>
                        </div>
                        <p className="text-gray-300 text-xs mt-1">{KARMIC_LESSON_MEANINGS[parseInt(lesson)]}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {karmicLessonMembers[lesson]?.slice(0, 7).map((name, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-white/5 rounded text-xs text-gray-400">{name}</span>
                          ))}
                          {karmicLessonMembers[lesson]?.length > 7 && (
                            <span className="text-xs text-gray-500">+{karmicLessonMembers[lesson].length - 7} more</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Family Karma Insight */}
            {sortedKarmicDebts.length > 0 && (
              <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <h4 className="text-purple-300 font-semibold mb-2">🔮 Family Karma Insight</h4>
                <p className="text-gray-300 text-sm">
                  {sortedKarmicDebts.length === 1 
                    ? `Your family carries the ${sortedKarmicDebts[0][0]} karmic debt. This is a soul contract your lineage is working to resolve through ${KARMIC_DEBT_MEANINGS[parseInt(sortedKarmicDebts[0][0])]?.lesson.toLowerCase() || 'spiritual growth'}.`
                    : `Your family carries ${sortedKarmicDebts.length} karmic debt patterns. The most prevalent is ${sortedKarmicDebts[0][0]}, appearing in ${sortedKarmicDebts[0][1]} members. Awareness of these patterns allows conscious healing across generations.`
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}