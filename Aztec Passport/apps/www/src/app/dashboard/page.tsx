import React from 'react';

import { HumanityScore, Passport, Verification } from './_components';

const Dashboard = () => {
  return (
    <div className='max-w-screen py-12'>
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
