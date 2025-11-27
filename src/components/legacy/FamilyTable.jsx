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
      // Use provided familyId or get current user's family
      if (familyId) {
        members = await base44.entities.FamilyMember.filter({ family_id: familyId });
      } else {
        // Try to get current user's family
        const { base44: b44 } = await import('@/api/base44Client');
        const user = await b44.auth.me();
        let memberRecord = await b44.entities.FamilyMember.filter({ email: user.email });
        let selfMember = memberRecord.find(m => m.relationship === 'self') || memberRecord[0];
        if (!selfMember) {
          const createdMembers = await b44.entities.FamilyMember.filter({ created_by: user.email });
          selfMember = createdMembers[0];
        }
        if (selfMember?.family_id) {
          members = await b44.entities.FamilyMember.filter({ family_id: selfMember.family_id });
        }
      }
      
      // Transform database records to display format
      const transformed = members.map(m => ({
        name: m.nickname ? `${m.full_name} (${m.nickname})` : m.full_name,
        lifePath: m.life_path_western || 0,
        expression: m.expression_western || 0,
        soulUrge: m.soul_urge_master || m.soul_urge_western || 0,
        personality: m.personality_western || 0,
        birthday: m.birthday_vibe || '',
        masters: m.master_numbers ? m.master_numbers.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n > 0) : [],
        sign: `${m.sun_sign || ''} / ${m.element || ''}${m.secondary_element ? '-' + m.secondary_element : ''}`.replace(' / -', ' / ').replace(' / /', ''),
        relationship: m.relationship,
        generation: m.generation,
        birthDate: m.birth_date
      }));

      // Sort by birth date (oldest first) to get proper generational order
      // This ensures great-great-great-grandparents come before great-great-grandparents, etc.
      transformed.sort((a, b) => {
        // First sort by birth year (oldest first)
        const aYear = a.birthDate ? new Date(a.birthDate).getFullYear() : 9999;
        const bYear = b.birthDate ? new Date(b.birthDate).getFullYear() : 9999;
        
        // Group by approximate generation (within 15 years = same generation)
        const aGenGroup = Math.floor(aYear / 25);
        const bGenGroup = Math.floor(bYear / 25);
        
        if (aGenGroup !== bGenGroup) {
          return aGenGroup - bGenGroup; // Older generations first
        }
        
        // Within same generation, sort by birth year (men typically born slightly before in couples)
        return aYear - bYear;
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