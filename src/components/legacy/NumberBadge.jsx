import React from 'react';
import { cn } from '@/lib/utils';

export default function NumberBadge({ number, onClick, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  const masterNumbers = [11, 22, 33];
  const isMaster = masterNumbers.includes(number);

  return (
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
  );
}