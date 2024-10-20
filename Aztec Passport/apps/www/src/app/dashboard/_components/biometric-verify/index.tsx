import React from 'react';

import { FaceIDVerify } from './face-id';

export const BiometricVerify = () => {
  return (
    <div className='hide-scrollbar h-[24rem] overflow-y-scroll rounded-[3rem] bg-[#EDF1ED] p-8'>
      <div className='text-2xl font-medium text-neutral-800'>
        Biometric Verification
      </div>
      <p className='py-2 text-sm font-medium text-neutral-600'>
        Verify biometric data for any valid Digital Identity such as Passports,
        National ID, Driver&lsquo;s License, etc.
      </p>
      <div className='grid grid-cols-1 gap-4 pt-4 md:grid-cols-3'>
        <FaceIDVerify />
      </div>
    </div>
  );
};
