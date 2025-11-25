import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, X, Plus } from 'lucide-react';
import NumberBadge from '@/components/legacy/NumberBadge';

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
                return (
                  <div 
                    key={id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg border border-white/20"
                  >
                    <span className="text-white text-sm">{member.nickname || member.full_name?.split(' ')[0]}</span>
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
          <div className="space-y-2">
            <p className="text-xs text-gray-400">Add Fighter:</p>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {availableMembers
                .filter(m => !selectedIds.includes(m.id))
                .map(member => (
                  <button
                    key={member.id}
                    onClick={() => onToggle(member.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/15 rounded-lg border border-white/10 transition-colors text-left"
                  >
                    <Plus className="w-4 h-4 text-green-400" />
                    <span className="text-white text-sm truncate">{member.nickname || member.full_name?.split(' ')[0]}</span>
                    <NumberBadge number={member.life_path_western} size="sm" />
                  </button>
                ))}
            </div>
          </div>
        )}
        
        {availableMembers.filter(m => !selectedIds.includes(m.id)).length === 0 && selectedIds.length < maxSize && (
          <p className="text-gray-500 text-sm text-center py-4">No more fighters available</p>
        )}
      </CardContent>
    </Card>
  );
}