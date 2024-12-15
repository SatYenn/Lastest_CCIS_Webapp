import React from 'react';
import { cn } from '@/lib/utils';

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: string | number;
}

export function ScrollArea({ maxHeight, className, children, ...props }: ScrollAreaProps) {
  return (
    <div
      className={cn(
        'overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent',
        className
      )}
      style={{ maxHeight }}
      {...props}
    >
      {children}
    </div>
  );
}