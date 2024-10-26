import React, { useState } from 'react';

import { usePassport } from '~/lib/hooks';
import { sleep, truncate } from '~/lib/utils';

import ENSLogo from 'public/assets/ens.svg';
import { toast } from 'sonner';

import { Input } from '~/components/ui/input';
import { StepButton } from '~/components/ui/step-button';

import { Loader2Icon } from 'lucide-react';

export const ENSVerify = () => {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'complete' | 'error'
  >('idle');
  const { verifyENS } = usePassport();

  const [name, setName] = useState<string>('');

  const onVerify = async () => {
    try {
      setStatus('loading');
      if (name.length <= 0) {
        throw new Error('Please enter a valid ENS domain');
      }
      const tx = await verifyENS(name);
      toast.success('ENS verification successful', {
        description: `Transaction ID: ${truncate(tx.txHash.to0xString())}`,
      });
      await sleep(3000);
      setStatus('complete');
      await sleep(1000);
    } catch (error) {
      setStatus('error');
      console.error(error);
      await sleep(3000);
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className='flex flex-col gap-2 rounded-2xl bg-[#d2ffd9] p-4 text-[#223f26]'>
      <img alt='ENS Logo' className='my-2 h-[2rem] w-[2rem]' src={ENSLogo} />
      <div className='text-xl font-medium'>Ethereum Name Service</div>
      <p className='text-sm font-medium text-[#305835]'>
        Verify your ENS Domain.
      </p>
      <Input
        className='h-9 border-none'
        placeholder='ENS Domain'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <StepButton
        className='!dark h-9 font-semibold !text-[#223f26]'
        currentMode={status}
        errorContent={
          <div className='flex flex-row items-center justify-center gap-2'>
            <div>❌</div> Error
          </div>
        }
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
