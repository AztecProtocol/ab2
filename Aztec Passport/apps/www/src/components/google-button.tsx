import React from 'react';

import { truncate } from '~/lib/utils';

import { Button } from './ui/button';

export const GoogleLoginButton = () => {
  const isLoggedIn = true;
  if (!isLoggedIn) {
    return (
      <Button className='w-full max-w-[9rem] !rounded-full bg-[#677DFF] text-base'>
        Login
      </Button>
    );
  }

  return (
    <div className='flex flex-row items-end text-sm'>
      {truncate('vedantchainani1084@gmail.com', 36)}
      <Button className='!my-0 h-5 w-fit !py-0 text-xs' variant='link'>
        Logout
      </Button>
    </div>
  );
};
