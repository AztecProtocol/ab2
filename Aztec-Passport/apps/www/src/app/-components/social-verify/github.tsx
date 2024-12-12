import React, { useState } from 'react';

import { usePassport } from '~/lib/hooks';
import { sleep, truncate } from '~/lib/utils';

import GitHubLogo from 'public/assets/github.svg';
import { toast } from 'sonner';

import { StepButton } from '~/components/ui/step-button';

import { Loader2Icon } from 'lucide-react';

export const GitHubVerify: React.FC = () => {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'complete' | 'error'
  >('idle');
  const { verifyGithub } = usePassport();

  /**
   * Handles GitHub account verification process
   */
  const onVerify = async () => {
    try {
      setStatus('loading');

      // Simulate API call to verify GitHub account
      const tx = await verifyGithub();

      // Notify user of success
      toast.success('GitHub verification successful', {
        description: `Transaction ID: ${truncate(tx.txHash.to0xString())}`,
      });

      // Simulate transitions between states
      await sleep(3000);
      setStatus('complete');
      await sleep(1000);
    } catch (error: unknown) {
      setStatus('error');

      // Handle errors with user-friendly messages
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(`GitHub Verification Failed: ${errorMessage}`);
      console.error('Verification Error:', error);

      await sleep(3000);
    } finally {
      setStatus('idle');
    }
  };

  // Reusable content for button states
  const buttonContent = {
    error: (
      <div className='flex flex-row items-center justify-center gap-2'>
        <div>❌</div> Error
      </div>
    ),
    success: (
      <div className='flex flex-row items-center justify-center gap-2'>
        <div>✅</div> Verified
      </div>
    ),
    initial: (
      <div className='flex flex-row items-center justify-center gap-2'>
        Verify
      </div>
    ),
    loading: (
      <div className='flex flex-row items-center justify-center gap-1'>
        <Loader2Icon className='animate-spin' size={18} />
        Verifying...
      </div>
    ),
  };

  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl border p-4 text-neutral-200 ${
        status === 'error' ? 'border-red-500' : 'border-neutral-300'
      }`}
    >
      {/* GitHub Logo */}
      <img
        alt='GitHub Logo'
        className='my-2 h-[2rem] w-[2rem]'
        src={GitHubLogo}
        aria-hidden='true'
      />
      <div className='text-xl font-medium'>GitHub</div>
      <p className='text-sm font-medium text-neutral-400'>
        Verify your GitHub account.
      </p>

      {/* StepButton with dynamic state-based content */}
      <StepButton
        className='!dark mt-6 h-9 font-semibold !text-black'
        currentMode={status}
        errorContent={buttonContent.error}
        finalContent={buttonContent.success}
        initialContent={buttonContent.initial}
        loadingContent={buttonContent.loading}
        onClick={onVerify}
      />
    </div>
  );
};
