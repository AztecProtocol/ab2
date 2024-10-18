import React from 'react';

import { Navbar } from '~/components/navbar';

import { HumanityScore, Passport } from './_components';

const Dashboard = () => {
  return (
    <div className='max-w-screen'>
      <div className='h-[8dvh] border-b'>
        <Navbar />
      </div>
      <div className='flex flex-col py-12'>
        <div className='mx-auto'>
          <HumanityScore />
        </div>
        <div className='relative mx-auto my-12'>
          <Passport />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
