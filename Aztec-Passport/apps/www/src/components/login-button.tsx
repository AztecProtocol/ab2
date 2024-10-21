'use client';

import React, { useState } from 'react';

import { useAztecAccount } from '~/lib/hooks';

import { StepButton } from './ui/step-button';
import { UserModal } from './user-modal';

import { Loader2Icon } from 'lucide-react';

export const LoginButton = () => {
  const [currentMode, setCurrentMode] = useState<
    'idle' | 'loading' | 'complete'
  >('idle');

  const { createAccount } = useAztecAccount();

  const onSignUp = async () => {
    setCurrentMode('loading');
    await createAccount();
    setCurrentMode('complete');
    setTimeout(() => {
      setCurrentMode('idle');
    }, 5000);
  };

  return (
    <div>
      <StepButton
        className='h-9 w-[12rem] !rounded-3xl !px-0 text-base'
        currentMode={currentMode}
        finalContent={
          <div className='flex flex-row items-center justify-center gap-2'>
            <div>✅</div> Created
          </div>
        }
        initialContent={
          <div className='flex flex-row items-center justify-center gap-2'>
            Create Passport <div>✈️</div>
          </div>
        }
        loadingContent={
          <div className='flex flex-row items-center justify-center gap-1'>
            <Loader2Icon className='animate-spin' size={18} />
            Creating...
          </div>
        }
        variants={{
          initial: { y: '-120%' },
          animate: { y: '0%' },
          exit: { y: '120%' },
        }}
        onClick={onSignUp}
      />
    </div>
  );

  return <UserModal />;
};
