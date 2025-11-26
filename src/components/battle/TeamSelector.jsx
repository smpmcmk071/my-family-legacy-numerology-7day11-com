import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, X, Plus } from 'lucide-react';
import NumberBadge from '@/components/legacy/NumberBadge';
import { getCategoryIcon } from './BattleCharacters';

export default function TeamSelector({ 
  teamNumber, 
  members, 
  selectedIds, 
  onToggle, 
  maxSize = 3,
  otherTeamIds = []
}) {
  const isLeft = teamNumber === 1;
  const availableMembers = members.filter(m => !otherTeamIds.includes(m.id));
  
  // Group available members by type
  const familyMembers = availableMembers.filter(m => !m.isCharacter);
  const biblicalChars = availableMembers.filter(m => m.isCharacter && m.category === 'biblical');
  const superheroChars = availableMembers.filter(m => m.isCharacter && m.category === 'superhero');
  
  const getMemberDisplay = (member) => {
    const icon = member.isCharacter ? getCategoryIcon(member.category) : '👤';
    const name = member.nickname || member.name || member.full_name?.split(' ')[0];
    return { icon, name };
  };
  
  return (
    <Card className={`bg-gradient-to-br ${isLeft ? 'from-blue-900/50 to-purple-900/50' : 'from-red-900/50 to-orange-900/50'} border-white/20 flex-1`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team {teamNumber}
          </span>
          <Badge variant="outline" className="text-white border-white/30">
            {selectedIds.length}/{maxSize}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Selected Members */}
        {selectedIds.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-400">Selected Fighters:</p>
            <div className="flex flex-wrap gap-2">
              {selectedIds.map(id => {
                const member = members.find(m => m.id === id);
                if (!member) return null;
                const { icon, name } = getMemberDisplay(member);
                return (
                  <div 
                    key={id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg border border-white/20"
                  >
                    <span className="text-sm">{icon}</span>
                    <span className="text-white text-sm">{name}</span>
                    <NumberBadge number={member.life_path_western} size="sm" />
                    <button 
                      onClick={() => onToggle(id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Available Members */}
        {selectedIds.length < maxSize && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {/* Family Members Section */}
            {familyMembers.filter(m => !selectedIds.includes(m.id)).length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-amber-400 font-semibold">👨‍👩‍👧‍👦 Family</p>
                <div className="grid grid-cols-2 gap-1">
                  {familyMembers
                    .filter(m => !selectedIds.includes(m.id))
                    .map(member => {
                      const { icon, name } = getMemberDisplay(member);
                      return (
                        <button
                          key={member.id}
                          onClick={() => onToggle(member.id)}
                          className="flex items-center gap-1 px-2 py-1.5 bg-white/5 hover:bg-white/15 rounded-lg border border-white/10 transition-colors text-left"
                        >
                          <Plus className="w-3 h-3 text-green-400 flex-shrink-0" />
                          <span className="text-white text-xs truncate">{name}</span>
                          <NumberBadge number={member.life_path_western} size="sm" />
                        </button>
                      );
                    })}
                </div>
              </div>
            )}
            
            {/* Biblical Characters Section */}
            {biblicalChars.filter(m => !selectedIds.includes(m.id)).length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-amber-400 font-semibold">📖 Biblical Heroes</p>
                <div className="grid grid-cols-2 gap-1">
                  {biblicalChars
                    .filter(m => !selectedIds.includes(m.id))
                    .map(member => {
                      const { name } = getMemberDisplay(member);
                      return (
                        <button
                          key={member.id}
                          onClick={() => onToggle(member.id)}
                          className="flex items-center gap-1 px-2 py-1.5 bg-amber-900/20 hover:bg-amber-900/40 rounded-lg border border-amber-500/20 transition-colors text-left"
                        >
                          <Plus className="w-3 h-3 text-green-400 flex-shrink-0" />
                          <span className="text-white text-xs truncate">{name}</span>
                          <NumberBadge number={member.life_path_western} size="sm" />
                        </button>
                      );
                    })}
                </div>
              </div>
            )}
            
            {/* Superhero Characters Section */}
            {superheroChars.filter(m => !selectedIds.includes(m.id)).length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-blue-400 font-semibold">🦸 Superheroes</p>
                <div className="grid grid-cols-2 gap-1">
                  {superheroChars
                    .filter(m => !selectedIds.includes(m.id))
                    .map(member => {
                      const { name } = getMemberDisplay(member);
                      return (
                        <button
                          key={member.id}
                          onClick={() => onToggle(member.id)}
                          className="flex items-center gap-1 px-2 py-1.5 bg-blue-900/20 hover:bg-blue-900/40 rounded-lg border border-blue-500/20 transition-colors text-left"
                        >
                          <Plus className="w-3 h-3 text-green-400 flex-shrink-0" />
                          <span className="text-white text-xs truncate">{name}</span>
                          <NumberBadge number={member.life_path_western} size="sm" />
                        </button>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}
        
        {availableMembers.filter(m => !selectedIds.includes(m.id)).length === 0 && selectedIds.length < maxSize && (
          <p className="text-gray-500 text-sm text-center py-4">No more fighters available</p>
        )}
      </CardContent>
    </Card>
  );
}