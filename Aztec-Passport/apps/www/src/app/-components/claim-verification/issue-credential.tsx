import React, { useState } from 'react';

import { usePassport } from '~/lib/hooks';
import { errorHandler, sleep } from '~/lib/utils';

import * as jose from 'jose';
import { toast } from 'sonner';

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
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'complete' | 'error'
  >('idle');
  const [date, setDate] = useState<Date>();

  const { setCredential } = usePassport();

  const onVerify = async () => {
    try {
      setStatus('loading');

      if (!date) {
        throw new Error('Please select a date');
      }

      const birthdate = Math.floor(date.getTime() / 1000);
      const randomness = crypto.randomUUID().slice(0, 8);
      const secret = Buffer.from(randomness);
      const alg = 'HS256';

      const jwt = await new jose.SignJWT({ birthdate })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .sign(secret);

      setCredential({
        jwt,
        secret_key: randomness,
      });

      toast.success('Credential Issued successful');
      await sleep(3000);
      setStatus('complete');
      await sleep(1000);
    } catch (error) {
      setStatus('error');
      toast.error(errorHandler(error));
      console.error(error);
      await sleep(3000);
    } finally {
      setStatus('idle');
    }
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
              errorContent={
                <div className='flex flex-row items-center justify-center gap-2'>
                  <div>❌</div> Error
                </div>
              }
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
