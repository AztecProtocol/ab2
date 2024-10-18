import React from 'react';

import { Navbar } from '../../components/navbar/index';
import { HumanityScore } from './_components/humanity-score';

const Dashboard = () => {
  return (
    <div>
      <div className='h-[8dvh] border-b'>
        <Navbar />
      </div>
      <div className='flex flex-col py-12'>
        <div className='mx-auto'>
          <HumanityScore />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
