import React from 'react';

import { CredentialVerify } from './credential';

export const ClaimsVerify = () => {
  return (
    <div className='hide-scrollbar h-[24rem] overflow-y-scroll rounded-[3rem] bg-[#B3A1FF] p-8'>
      <div className='text-2xl font-medium text-neutral-800'>
        Claims Verification
      </div>
      <p className='py-2 text-sm font-medium text-neutral-600'>
        Verify your claims such as JWTs. DIDs and more information about your
        identity.
      </p>
      <div className='grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 md:grid-cols-3'>
        <CredentialVerify />
      </div>
    </div>
  );
};
