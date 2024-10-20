'use client';

import React from 'react';

import { truncate } from '~/lib/utils';

import { useGoogleAuth } from '@zk-email/zk-email-sdk';

import { Button } from './ui/button';

export const GoogleLoginButton = () => {
  const { isGoogleAuthed, googleLogIn, googleLogOut, loggedInGmail } =
    useGoogleAuth();
  if (!isGoogleAuthed) {
    return (
      <Button
        className='w-full max-w-[9rem] !rounded-full bg-[#677DFF] text-base'
        onClick={googleLogIn}
      >
        Login
      </Button>
    );
  }

  return (
    <div className='flex flex-row items-end text-sm'>
      {truncate(loggedInGmail ?? '', 36)}
      <Button
        className='!my-0 h-5 w-fit !py-0 text-xs'
        variant='link'
        onClick={googleLogOut}
      >
        Logout
      </Button>
    </div>
  );
};
