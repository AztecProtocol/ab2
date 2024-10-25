import React, { type ReactNode } from 'react';

import { cn } from '~/lib/utils';

import { AnimatePresence, type Variants, motion } from 'framer-motion';

import { Button, type ButtonProps } from './button';

interface StepButtonProps extends ButtonProps {
  initialContent: ReactNode;
  loadingContent: ReactNode;
  finalContent: ReactNode;
  errorContent?: ReactNode;
  currentMode: 'idle' | 'loading' | 'complete' | 'error';
  variants: Variants;
}

export const StepButton = ({
  initialContent,
  loadingContent,
  finalContent,
  currentMode,
  className,
  variants,
  errorContent,
  ...props
}: StepButtonProps) => {
  return (
    <Button {...props} className={cn('overflow-hidden', className)}>
      <AnimatePresence mode='wait'>
        {currentMode === 'idle' && (
          <motion.div
            key='initial'
            animate='animate'
            className='w-full'
            exit='exit'
            initial='initial'
            variants={variants}
          >
            {initialContent}
          </motion.div>
        )}
        {currentMode === 'loading' && (
          <motion.div
            key='loading'
            animate='animate'
            className='w-full'
            exit='exit'
            initial='initial'
            variants={variants}
          >
            {loadingContent}
          </motion.div>
        )}
        {currentMode === 'complete' && (
          <motion.div
            key='complete'
            animate='animate'
            className='w-full'
            exit='exit'
            initial='initial'
            variants={variants}
          >
            {finalContent}
          </motion.div>
        )}
        {currentMode === 'error' && (
          <motion.div
            key='error'
            animate='animate'
            className='w-full'
            exit='exit'
            initial='initial'
            variants={variants}
          >
            {errorContent}
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
};
