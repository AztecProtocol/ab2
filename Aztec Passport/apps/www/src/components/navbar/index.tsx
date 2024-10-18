import React from 'react';

export const Navbar = () => {
  return (
    <div className='fixed top-0 z-[2] h-[6dvh] w-full border'>
      <div className='mx-auto flex h-full max-w-screen-2xl items-center justify-between px-12'>
        <div className='text-xl font-semibold'>Web3 Starter</div>
      </div>
    </div>
  );
};
