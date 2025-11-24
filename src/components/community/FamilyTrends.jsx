import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Star, Flame, Droplet, Wind, Mountain } from 'lucide-react';
import NumberBadge from '@/components/legacy/NumberBadge';

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
    if (m.master_numbers) {
      masterNumberMembers.push({ name: m.nickname || m.full_name?.split(' ')[0], masters: m.master_numbers });
    }
  });

  const sortedLifePaths = Object.entries(lifePathCounts).sort((a, b) => b[1] - a[1]);
  const sortedExpressions = Object.entries(expressionCounts).sort((a, b) => b[1] - a[1]);
  const sortedElements = Object.entries(elementCounts).sort((a, b) => b[1] - a[1]);
  const totalMembers = familyMembers.length;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="py-4 text-center">
            <Users className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{totalMembers}</p>
            <p className="text-xs text-gray-400">Family Members</p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="py-4 text-center">
            <Star className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{masterNumberMembers.length}</p>
            <p className="text-xs text-gray-400">With Master Numbers</p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="py-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{sortedLifePaths[0]?.[0] || '-'}</p>
            <p className="text-xs text-gray-400">Most Common LP</p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="py-4 text-center">
            {sortedElements[0] && ELEMENT_ICONS[sortedElements[0][0]] ? (
              React.createElement(ELEMENT_ICONS[sortedElements[0][0]], { className: 'w-6 h-6 text-cyan-400 mx-auto mb-2' })
            ) : (
              <Flame className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            )}
            <p className="text-2xl font-bold text-white">{sortedElements[0]?.[0] || '-'}</p>
            <p className="text-xs text-gray-400">Dominant Element</p>
          </CardContent>
        </Card>
      </div>

      {/* Life Path Distribution */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-lg">Life Path Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedLifePaths.map(([num, count]) => {
              const percentage = Math.round((count / totalMembers) * 100);
              return (
                <div key={num} className="flex items-center gap-3">
                  <NumberBadge number={parseInt(num)} size="sm" />
                  <div className="flex-1">
                    <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-white text-sm w-16 text-right">{count} ({percentage}%)</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Expression Number Distribution */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-lg">Expression/Destiny Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedExpressions.slice(0, 5).map(([num, count]) => {
              const percentage = Math.round((count / totalMembers) * 100);
              return (
                <div key={num} className="flex items-center gap-3">
                  <NumberBadge number={parseInt(num)} size="sm" />
                  <div className="flex-1">
                    <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-white text-sm w-16 text-right">{count} ({percentage}%)</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Element Distribution */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-lg">Elemental Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <div key={element} className={`p-4 rounded-lg bg-gradient-to-br ${colors[element]} bg-opacity-20 border`}>
                  <Icon className="w-6 h-6 text-white mb-2" />
                  <p className="text-white font-bold">{element}</p>
                  <p className="text-white/80 text-sm">{count} members ({percentage}%)</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Master Number Carriers */}
      {masterNumberMembers.length > 0 && (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              Master Number Carriers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {masterNumberMembers.map((m, i) => (
                <div key={i} className="px-3 py-2 bg-amber-500/20 rounded-lg border border-amber-500/30">
                  <p className="text-white font-medium">{m.name}</p>
                  <div className="flex gap-1 mt-1">
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
    </div>
  );
}