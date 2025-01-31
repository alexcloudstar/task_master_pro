import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-sky-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-sky-950 placeholder:text-sky-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-sky-800 dark:file:text-sky-50 dark:placeholder:text-sky-400 dark:focus-visible:ring-sky-300',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
