'use client';

import React, { useState } from 'react';

import { motion } from 'framer-motion';

import { Button } from '~/components/ui/button';

import { BiometricVerify } from './biometric-verify';
import { ClaimsVerify } from './claim-verification';
import { OnChainVerify } from './on-chain-verify';
import { SocialVerify } from './social-verify';

import { ArrowLeft, ArrowRight } from 'lucide-react';

const options = [
  {
    type: 'claims',
    component: <ClaimsVerify />,
  },
  {
    type: 'on-chain',
    component: <OnChainVerify />,
  },
  {
    type: 'biometric',
    component: <BiometricVerify />,
  },
  {
    type: 'social',
    component: <SocialVerify />,
  },
];

export const Verification = () => {
  const CARD_OFFSET = 10;
  const SCALE_FACTOR = 0.06;

  const [verificationOptions, setVerificationOptions] =
    useState<typeof options>(options);

  const onNext = () => {
    const newArr = [...verificationOptions];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- safe
    newArr.unshift(newArr.pop()!);
    setVerificationOptions(newArr);
  };

  const onPrev = () => {
    const newArr = [...verificationOptions];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- safe
    newArr.push(newArr.shift()!);
    setVerificationOptions(newArr);
  };

  return (
    <div className='flex flex-col gap-12 px-3'>
      <div className='flex w-full justify-end gap-3'>
        <Button
          className='h-12 w-12 !rounded-full !p-0'
          variant='secondary'
          onClick={onPrev}
        >
          <ArrowLeft size={24} />
        </Button>
        <Button
          className='h-12 w-12 !rounded-full !p-0'
          variant='secondary'
          onClick={onNext}
        >
          <ArrowRight size={24} />
        </Button>
      </div>
      <div className='relative'>
        {verificationOptions.map((option, index) => {
          return (
            <motion.div
              key={option.type}
              className='absolute w-full'
              animate={{
                top: index * -CARD_OFFSET,
                scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
                zIndex: verificationOptions.length - index, //  decrease z-index for the cards that are behind
                transition: {
                  type: 'spring',
                  stiffness: 300,
                  damping: 15,
                },
              }}
              style={{
                transformOrigin: 'top center',
              }}
            >
              {option.component}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
