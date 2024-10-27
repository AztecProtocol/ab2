import * as React from 'react';

import { createFileRoute } from '@tanstack/react-router';
import { Navbar } from '~/components';

import { HumanityScore, Passport, Verification } from './-components';

const AboutComponent = () => {
  return (
    <div className='hide-scrollbar max-h-screen overflow-y-scroll py-4'>
      <Navbar />
      <div className='flex flex-col'>
        <div className='mx-auto'>
          <HumanityScore />
        </div>
        <div className='relative mx-auto my-4'>
          <Passport />
        </div>
        <div className='relative mx-auto flex min-h-[30rem] w-full max-w-screen-xl flex-col'>
          <Verification />
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/dashboard')({
  component: AboutComponent,
});
