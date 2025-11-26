import React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { compoundVibes, numerologyMeanings } from './numerologyData';

// Get title for any number (1-100)
const getNumberTitle = (num) => {
  // Check master/core numbers first
  if (numerologyMeanings[num]) {
    return numerologyMeanings[num].title;
  }
  // Check compound vibes (10-100)
  if (compoundVibes[num]) {
    return compoundVibes[num].title;
  }
  return `Number ${num}`;
};

export default function NumberBadge({ number, onClick, size = 'md', showRaw = false, rawTotal = null }) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  const masterNumbers = [11, 22, 33, 44, 55, 66, 77, 88, 99];
  const isMaster = masterNumbers.includes(number);
  const title = getNumberTitle(number);
  
  // Get compound vibe if raw total is provided
  const rawTitle = rawTotal && rawTotal !== number ? getNumberTitle(rawTotal) : null;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => onClick && onClick(number, rawTotal)}
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
          {rawTitle && (
            <p className="text-xs text-gray-400 mt-1">
              From {rawTotal}: {rawTitle}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}