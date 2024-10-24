import React, { useState } from 'react';

import { Button } from '~/components/ui/button';
import { DateTimePicker } from '~/components/ui/datetime-picker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { StepButton } from '~/components/ui/step-button';

import { Loader2Icon } from 'lucide-react';

export const IssueCredential = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'complete'>('idle');
  const [date, setDate] = useState<Date>();

  const onVerify = () => {
    setStatus('loading');
    setTimeout(() => {
      setStatus('complete');
    }, 3000);
    setTimeout(() => {
      setStatus('idle');
    }, 5000);
    setDate(undefined);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='h-6 !p-0' variant='link'>
          Issue here
        </Button>
      </DialogTrigger>
      <DialogContent className='!rounded-3xl border-none bg-[#B3A1FF]'>
        <DialogHeader>
          <DialogTitle className='text-2xl !font-semibold text-neutral-800'>
            Create a KYC Age Credential
          </DialogTitle>
          <DialogDescription className='text-base font-medium text-neutral-600'>
            This will generate and issue a mock Age Credential for the user. It
            can be used to verify JWT Claims for the Credential.
          </DialogDescription>
          <div className='!my-4 flex flex-col gap-3'>
            <DateTimePicker
              placeholder='Select your Birthday'
              value={date}
              onChange={setDate}
            />
            <StepButton
              className='dark h-9 font-semibold !text-[#223f26]'
              currentMode={status}
              finalContent={
                <div className='flex flex-row items-center justify-center gap-2'>
                  <div>✅</div> Credential Issued
                </div>
              }
              initialContent={
                <div className='flex flex-row items-center justify-center gap-2'>
                  Issue Credential
                </div>
              }
              loadingContent={
                <div className='flex flex-row items-center justify-center gap-1'>
                  <Loader2Icon className='animate-spin' size={18} />
                  Issuing...
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
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
