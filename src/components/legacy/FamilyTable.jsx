import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { base44 } from '@/api/base44Client';
import NumberBadge from './NumberBadge';
import { Loader2 } from 'lucide-react';

export default function FamilyTable({ onNumberClick, highlightPerson, familyId }) {
  const [familyData, setFamilyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFamilyMembers = async () => {
      setLoading(true);
      let members = [];
      if (familyId) {
        members = await base44.entities.FamilyMember.filter({ family_id: familyId });
      } else {
        members = await base44.entities.FamilyMember.list();
      }
      
      // Transform database records to display format
      const transformed = members.map(m => ({
        name: m.nickname ? `${m.full_name} (${m.nickname})` : m.full_name,
        lifePath: m.life_path_western || 0,
        expression: m.expression_western || 0,
        soulUrge: m.soul_urge_master || m.soul_urge_western || 0,
        personality: m.personality_western || 0,
        birthday: m.birthday_vibe || '',
        masters: m.master_numbers ? m.master_numbers.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)) : [],
        sign: `${m.sun_sign || ''} / ${m.element || ''}${m.secondary_element ? '-' + m.secondary_element : ''}`.replace(' / -', ' / ').replace(' / /', ''),
        relationship: m.relationship,
        generation: m.generation
      }));

      // Sort by generation (oldest first) then by relationship
      const relationshipOrder = ['great-great-great-grandparent', 'great-great-grandparent', 'great-grandparent', 'grandparent', 'parent', 'uncle', 'aunt', 'sibling', 'self', 'child', 'cousin', 'spouse'];
      transformed.sort((a, b) => {
        if (a.generation !== b.generation) return (a.generation || 99) - (b.generation || 99);
        return relationshipOrder.indexOf(a.relationship) - relationshipOrder.indexOf(b.relationship);
      });

      setFamilyData(transformed);
      setLoading(false);
    };
    loadFamilyMembers();
  }, [familyId]);

  const parseNumber = (value) => {
    if (typeof value === 'string') {
      const parts = value.split('/');
      return parseInt(parts[parts.length - 1]);
    }
    return value;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (familyData.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No family members found. Add members to see the legacy table.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border-2 border-gray-200 shadow-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-amber-100 to-orange-100">
            <TableHead className="font-bold text-gray-900">Name</TableHead>
            <TableHead className="font-bold text-gray-900 text-center">Life Path</TableHead>
            <TableHead className="font-bold text-gray-900 text-center">Expression</TableHead>
            <TableHead className="font-bold text-gray-900 text-center">Soul Urge</TableHead>
            <TableHead className="font-bold text-gray-900 text-center">Personality</TableHead>
            <TableHead className="font-bold text-gray-900 text-center">Birthday#</TableHead>
            <TableHead className="font-bold text-gray-900">Main Masters</TableHead>
            <TableHead className="font-bold text-gray-900">Sun/Triplicity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {familyData.map((person, idx) => {
            const isHighlighted = highlightPerson ? person.name.includes(highlightPerson) : false;
            return (
              <TableRow 
                key={idx} 
                className={isHighlighted ? 'bg-amber-50 font-semibold' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <TableCell className={isHighlighted ? 'font-bold text-amber-900' : 'font-medium'}>
                  {person.name}
                </TableCell>
                <TableCell className="text-center">
                  <NumberBadge number={person.lifePath} onClick={onNumberClick} />
                </TableCell>
                <TableCell className="text-center">
                  <NumberBadge number={person.expression} onClick={onNumberClick} />
                </TableCell>
                <TableCell className="text-center">
                  <NumberBadge number={parseNumber(person.soulUrge)} onClick={onNumberClick} />
                </TableCell>
                <TableCell className="text-center">
                  <NumberBadge number={person.personality} onClick={onNumberClick} />
                </TableCell>
                <TableCell className="text-center text-sm text-gray-700">
                  {person.birthday}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {person.masters.map((num, i) => (
                      <NumberBadge key={i} number={num} onClick={onNumberClick} size="sm" />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-700">
                  {person.sign}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}