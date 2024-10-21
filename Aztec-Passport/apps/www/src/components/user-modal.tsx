import React from 'react';

import EthereumLogo from 'public/assets/eth.svg';
import GoogleLogo from 'public/assets/google.svg';

import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

import { GoogleLoginButton } from './google-button';

export const UserModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='my-6 !rounded-full' variant='secondary'>
          User Modal
        </Button>
      </DialogTrigger>
      <DialogContent className='min-h-[30rem] !rounded-3xl border-none bg-[#ffffff]'>
        <DialogHeader>
          <DialogTitle className='text-2xl !font-semibold text-neutral-800'>
            User Details
          </DialogTitle>

          <div className='!my-4 flex flex-col gap-6'>
            <div className='flex flex-row items-center justify-between'>
              <div className='flex flex-row items-center gap-2 text-lg font-medium'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200'>
                  <img
                    alt='Ethereum Logo'
                    height={18}
                    src={EthereumLogo as unknown as string}
                    width={18}
                  />
                </div>
                Ethereum Wallet
              </div>
              <w3m-button balance='hide' />
            </div>
            <div className='flex flex-row items-center justify-between'>
              <div className='flex flex-row items-center gap-2 text-lg font-medium'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200'>
                  <img
                    alt='Google Logo'
                    height={18}
                    src={GoogleLogo as unknown as string}
                    width={18}
                  />
                </div>
                Google
              </div>
              <GoogleLoginButton />
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
