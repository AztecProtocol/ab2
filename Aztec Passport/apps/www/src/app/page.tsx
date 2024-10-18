import React from 'react';

import { Hero, Navbar } from '~/components';

const Home = () => {
  return (
    <div className='!dark text-white'>
      <Navbar />
      <Hero />
    </div>
  );
};

export default Home;
