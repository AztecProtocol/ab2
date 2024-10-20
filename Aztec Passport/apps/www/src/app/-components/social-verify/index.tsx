import React from 'react';

import { GitHubVerify } from './github';
import { GoogleVerify } from './google';
import { LinkedinVerify } from './linkedin';
import { XVerify } from './x';

export const SocialVerify = () => {
  return (
    <div className='hide-scrollbar h-[24rem] overflow-y-scroll rounded-[3rem] bg-[#222221] p-8 text-white'>
      <div className='text-2xl font-medium text-neutral-200'>
        Social Platforms
      </div>
      <p className='py-2 text-sm font-medium text-neutral-300'>
        Verify you social media accounts to increase your humanity score.
      </p>
      <div className='grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 md:grid-cols-4'>
        <XVerify />
        <GoogleVerify />
        <GitHubVerify />
        <LinkedinVerify />
      </div>
    </div>
  );
};
