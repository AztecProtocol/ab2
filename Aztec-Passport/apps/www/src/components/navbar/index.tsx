import React from 'react';

import { LoginButton } from '../login-button';

export const Navbar = () => {
  return (
    <div className='fixed top-0 z-[2] h-[8dvh] w-full'>
      <div className='mx-auto flex h-full max-w-screen-2xl items-center justify-between px-4'>
        <div className='text-2xl font-semibold'>Aztec Passport</div>
        <LoginButton />
      </div>
    </div>
  );
};
