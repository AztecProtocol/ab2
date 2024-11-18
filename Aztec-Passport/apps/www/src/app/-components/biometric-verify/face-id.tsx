import React from 'react';

import FaceIDLogo from 'public/assets/biometric.png';

import { FaceVerifyDialog } from './face-dialog';

export const FaceIDVerify = () => {
  return (
    <div className='flex flex-col gap-2 rounded-2xl bg-[#D0D2CE] p-4 text-[#223f26]'>
      <div className='my-2 flex flex-row items-center gap-2'>
        <img
          alt='Face ID Logo'
          className='h-[2rem] w-[2rem]'
          height={32}
          src={FaceIDLogo}
          width={32}
        />
        <div className='text-xl font-medium'>Face ID</div>
      </div>
      <p className='text-sm font-medium text-[#305835]'>
        Verify your Face Data for any valid Digital Identity such as Passports,
        National ID, etc.
      </p>
      <FaceVerifyDialog />
    </div>
  );
};
