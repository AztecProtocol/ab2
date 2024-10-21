import * as React from 'react';

import { createFileRoute } from '@tanstack/react-router';
import { Hero, Navbar } from '~/components';

const HomeComponent = () => {
  return (
    <div className='!dark text-white'>
      <Navbar />
      <Hero />
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: HomeComponent,
});
