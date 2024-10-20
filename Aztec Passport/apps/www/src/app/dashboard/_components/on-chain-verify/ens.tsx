import Image from 'next/image';

import React, { useState } from 'react';

import ENSLogo from 'public/assets/ens.svg';

import { StepButton } from '~/components/ui/step-button';

import { Loader2Icon } from 'lucide-react';

export const ENSVerify = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'complete'>('idle');

  const onVerify = () => {
    setStatus('loading');
    setTimeout(() => {
      setStatus('complete');
    }, 3000);
    setTimeout(() => {
      setStatus('idle');
    }, 5000);
  };

  return (
    <div className='flex flex-col gap-2 rounded-2xl bg-[#d2ffd9] p-4 text-[#223f26]'>
      <Image
        alt='ENS Logo'
        className='my-2 h-[2rem] w-[2rem]'
        src={ENSLogo as unknown as string}
      />
      <div className='text-xl font-medium'>Ethereum Name Service</div>
      <p className='text-sm font-medium text-[#305835]'>
        Verify your ENS Domain.
      </p>
      <StepButton
        className='!dark mt-6 h-9 font-semibold !text-[#223f26]'
        currentMode={status}
        finalContent={
          <div className='flex flex-row items-center justify-center gap-2'>
            <div>✅</div> Verified
          </div>
        }
        initialContent={
          <div className='flex flex-row items-center justify-center gap-2'>
            Verify
          </div>
        }
        loadingContent={
          <div className='flex flex-row items-center justify-center gap-1'>
            <Loader2Icon className='animate-spin' size={18} />
            Verifying...
          </div>
        }
        variants={{
          initial: { y: '-120%' },
          animate: { y: '0%' },
          exit: { y: '120%' },
        }}
        onClick={onVerify}
      />
    </div>
  );
};
