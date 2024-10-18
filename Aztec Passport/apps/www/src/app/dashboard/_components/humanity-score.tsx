'use client';

import React, { useState } from 'react';

import NumberFlow from '@number-flow/react';

import { Button } from '~/components/ui/button';

import { RefreshCcw } from 'lucide-react';

export const HumanityScore = () => {
  const [value, setValue] = useState<number>(34.8);
  const onRefetch = () => {
    const newValue = Math.random() * 100;
    setValue(newValue);
  };
  return (
    <div className='flex flex-col items-center justify-center'>
      <NumberFlow
        className='text-5xl font-medium'
        format={{ notation: 'standard', roundingPriority: 'auto' }}
        locales='en-US'
        value={value}
      />
      <div className='flex flex-row items-center justify-center gap-1 text-lg font-medium text-neutral-500'>
        Unique Humanity Score{' '}
        <Button
          className='!-m-0 flex h-8 w-8 items-center justify-center !p-0 text-neutral-500'
          variant='link'
          onClick={onRefetch}
        >
          <RefreshCcw size={16} />
        </Button>
      </div>
    </div>
  );
};
