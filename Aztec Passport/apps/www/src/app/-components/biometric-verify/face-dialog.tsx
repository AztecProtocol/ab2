import React from 'react';

import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

import { FaceStepper } from './face-stepper';

export const FaceVerifyDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='my-6'>Verify</Button>
      </DialogTrigger>
      <DialogContent className='min-h-[30rem] !rounded-3xl border-none bg-[#ffffff]'>
        <DialogHeader>
          <DialogTitle className='text-2xl !font-semibold text-neutral-800'>
            Verify Biometric Data
          </DialogTitle>
          <DialogDescription className='text-sm font-medium text-neutral-600'>
            This will verify your biometric data for any valid Digital Identity
            and compute face descriptors for your digital identity.
          </DialogDescription>
          <div className='!my-4 flex flex-col gap-3'>
            <FaceStepper />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
