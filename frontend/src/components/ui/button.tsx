import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-sky-300',
  {
    variants: {
      variant: {
        default:
          'bg-sky-900 text-sky-50 shadow hover:bg-sky-900/90 dark:bg-sky-50 dark:text-sky-900 dark:hover:bg-sky-50/90',
        destructive:
          'bg-red-500 text-sky-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-sky-50 dark:hover:bg-red-900/90',
        outline:
          'border border-sky-200 bg-white shadow-sm hover:bg-sky-100 hover:text-sky-900 dark:border-sky-800 dark:bg-sky-950 dark:hover:bg-sky-800 dark:hover:text-sky-50',
        secondary:
          'bg-sky-100 text-sky-900 shadow-sm hover:bg-sky-100/80 dark:bg-sky-800 dark:text-sky-50 dark:hover:bg-sky-800/80',
        ghost:
          'hover:bg-sky-100 hover:text-sky-900 dark:hover:bg-sky-800 dark:hover:text-sky-50',
        link: 'text-sky-900 underline-offset-4 hover:underline dark:text-sky-50',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
