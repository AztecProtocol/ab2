import React, { useState } from 'react';

import { usePassport } from '~/lib/hooks';
import { sleep, truncate } from '~/lib/utils';

import GoogleLogo from 'public/assets/google.svg';
import { toast } from 'sonner';

import { StepButton } from '~/components/ui/step-button';

import { Loader2Icon } from 'lucide-react';

export const GoogleVerify: React.FC = () => {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'complete' | 'error'
  >('idle');
  const { verifyGoogle } = usePassport();

  /**
   * Handles the Google account verification process
   */
  const onVerify = async () => {
    try {
      setStatus('loading');

      // Call verifyGoogle and process the result
      const tx = await verifyGoogle();
      const txHash = tx?.txHash?.to0xString?.() ?? 'N/A';

      // Notify success with transaction details
      toast.success('Google verification successful', {
        description: `Transaction ID: ${truncate(txHash)}`,
      });

      // Simulate transition delay for feedback
      await sleep(3000);
      setStatus('complete');
      await sleep(1000);
    } catch (error: unknown) {
      // Handle errors and provide user feedback
      setStatus('error');

      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(`Verification failed: ${errorMessage}`);
      console.error('Verification failed:', error);

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
      {/* Google Logo */}
      <img
        alt='Google Account Verification Logo'
        className='my-2 h-[2rem] w-[2rem]'
        src={GoogleLogo}
        aria-hidden='true'
      />
      <div className='text-xl font-medium'>Google</div>
      <p className='text-sm font-medium text-neutral-400'>
        Verify your Google account.
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
