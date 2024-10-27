import React from 'react';

import { Link, useLocation } from '@tanstack/react-router';

import { LoginButton } from '../login-button';
import { Button } from '../ui/button';

export const Navbar = () => {
  const location = useLocation();
  return (
    <div className='fixed top-0 z-[2] h-[8dvh] w-full'>
      <div className='mx-auto flex h-full max-w-screen-2xl items-center justify-between px-4'>
        <div className='text-2xl font-semibold'>Aztec Passport</div>
        <div className='flex flex-row items-center gap-2'>
          {location.href !== '/dashboard' && (
            <Button asChild className='h-9 w-fit !rounded-3xl px-4 text-base'>
              <Link to='/dashboard'>Dashboard</Link>
            </Button>
          )}
          <LoginButton />
        </div>
      </div>
    </div>
  );
};
