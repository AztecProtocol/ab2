import React from 'react';

import { BalanceVerify } from './balance';
import { ENSVerify } from './ens';

export const OnChainVerify = () => {
  return (
    <div className='hide-scrollbar h-[24rem] overflow-y-scroll rounded-[3rem] bg-[#A4F5A4] p-8 text-white'>
      <div className='text-2xl font-medium text-neutral-800'>
        On-Chain Activity
      </div>
      <p className='py-2 text-sm font-medium text-neutral-600'>
        Verify on-chain activity such as transactions, possession of ENS
        domains, and more to increase your humanity score.
      </p>
      <div className='grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 md:grid-cols-4'>
        <ENSVerify />
        <BalanceVerify />
      </div>
    </div>
  );
};
