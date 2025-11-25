import React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const NUMBER_TITLES = {
  1: 'The Leader - Independence & Innovation',
  2: 'The Diplomat - Cooperation & Balance',
  3: 'The Creator - Expression & Joy',
  4: 'The Builder - Stability & Discipline',
  5: 'The Free Spirit - Change & Adventure',
  6: 'The Nurturer - Love & Responsibility',
  7: 'The Seeker - Wisdom & Spirituality',
  8: 'The Achiever - Power & Abundance',
  9: 'The Humanitarian - Compassion & Completion',
  11: 'Master Visionary - Intuition & Enlightenment',
  22: 'Master Builder - Manifestation & Legacy',
  33: 'Master Teacher - Healing & Service'
};

export default function NumberBadge({ number, onClick, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  const masterNumbers = [11, 22, 33];
  const isMaster = masterNumbers.includes(number);
  const title = NUMBER_TITLES[number] || `Number ${number}`;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => onClick && onClick(number)}
            className={cn(
              "inline-flex items-center justify-center rounded-full font-bold transition-all print:cursor-default",
              sizeClasses[size],
              isMaster 
                ? "bg-gradient-to-br from-purple-500 to-pink-600 text-white hover:shadow-lg hover:scale-110" 
                : "bg-gradient-to-br from-amber-500 to-orange-600 text-white hover:shadow-lg hover:scale-110",
              "print:hover:scale-100 print:shadow-none"
            )}
            type="button"
          >
            {number}
          </button>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-900 text-white border-gray-700 max-w-xs">
          <p className="font-medium">{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}