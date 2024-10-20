import React from 'react';

import { Navbar } from '~/components';

import { HumanityScore, Passport, Verification } from './_components';

const Dashboard = () => {
  return (
    <div className='hide-scrollbar max-h-screen overflow-y-scroll py-12'>
      <Navbar />
      <div className='flex flex-col'>
        <div className='mx-auto'>
          <HumanityScore />
        </div>
        <div className='relative mx-auto my-12'>
          <Passport />
        </div>
        <div className='relative mx-auto flex min-h-[30rem] w-full max-w-screen-xl flex-col'>
          <Verification />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
