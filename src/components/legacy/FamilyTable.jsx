import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import NumberBadge from './NumberBadge';

const familyData = [
  {
    name: 'Thomas Francis Maher (Great-Grandpop)',
    lifePath: 3,
    expression: 11,
    soulUrge: 5,
    personality: 6,
    birthday: '5',
    masters: [3, 11, 5],
    sign: 'Taurus / Earth',
    highlight: true
  },
  {
    name: 'Mary Agnes O\'Neill Maher (Great-Grandma)',
    lifePath: 9,
    expression: 8,
    soulUrge: 7,
    personality: 1,
    birthday: '14/5',
    masters: [9, 8, 7, 1],
    sign: 'Virgo / Earth',
    highlight: true
  },
  {
    name: 'George Shotts Wilson (Pop Pop Wilson)',
    lifePath: 1,
    expression: 88,
    soulUrge: 1,
    personality: 6,
    birthday: '23/5',
    masters: [1, 44, 88],
    sign: 'Scorpio / Water',
    highlight: true
  },
  {
    name: 'Elizabeth Elanor Wilson (Maternal Grandma)',
    lifePath: 2,
    expression: 6,
    soulUrge: '33/6',
    personality: 3,
    birthday: '17/8',
    masters: [2, 6, 8, 33],
    sign: 'Leo / Fire-Water',
    highlight: true
  },
  {
    name: 'John Francis (Grandpop)',
    lifePath: 7,
    expression: 9,
    soulUrge: 22,
    personality: 5,
    birthday: '22-25/7',
    masters: [7, 11, 22, 9],
    sign: 'Sag / Fire-Water',
    highlight: true
  },
  {
    name: 'Elizabeth JoAnn (Grandma)',
    lifePath: 6,
    expression: 7,
    soulUrge: '33/6',
    personality: 1,
    birthday: '26/8',
    masters: [6, 7, 8, 33],
    sign: 'Cancer / Water-Earth',
    highlight: true
  },
  {
    name: 'Stephen (Dad)',
    lifePath: 7,
    expression: 11,
    soulUrge: 8,
    personality: 9,
    birthday: '25/7',
    masters: [7, 8, 9, 11],
    sign: 'Scorpio / Water-Air',
    highlight: true
  },
  {
    name: 'Amy (Mom)',
    lifePath: 11,
    expression: 5,
    soulUrge: 8,
    personality: 6,
    birthday: '27/9',
    masters: [11, 8, 6],
    sign: 'Capricorn / Earth',
    highlight: true
  },
  {
    name: 'Christian (Brother)',
    lifePath: 8,
    expression: 8,
    soulUrge: 11,
    personality: 6,
    birthday: '25/7',
    masters: [8, 7, 11],
    sign: 'Scorpio / Water-Earth'
  },
  {
    name: 'Kyle (Brother)',
    lifePath: 5,
    expression: 8,
    soulUrge: 1,
    personality: 7,
    birthday: '19/1',
    masters: [5, 7, 8, 1],
    sign: 'Cancer / Water-Fire'
  },
  {
    name: 'Melanie (Sister)',
    lifePath: 1,
    expression: 3,
    soulUrge: '33/6',
    personality: 6,
    birthday: '28/1',
    masters: [1, 3, 6, 33],
    sign: 'Libra / Air-Earth'
  },
  {
    name: 'David (Uncle)',
    lifePath: 9,
    expression: 3,
    soulUrge: 11,
    personality: 2,
    birthday: '1',
    masters: [9, 11, 3],
    sign: 'Taurus / Earth'
  },
  {
    name: 'Kenneth (Uncle)',
    lifePath: 11,
    expression: 5,
    soulUrge: 11,
    personality: 9,
    birthday: '18/9',
    masters: [11, 9, 5],
    sign: 'Aquarius / Air'
  }
];

export default function FamilyTable({ onNumberClick, highlightPerson }) {
  const parseNumber = (value) => {
    if (typeof value === 'string') {
      const parts = value.split('/');
      return parseInt(parts[parts.length - 1]);
    }
    return value;
  };

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
            const isHighlighted = highlightPerson ? person.name === highlightPerson : false;
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