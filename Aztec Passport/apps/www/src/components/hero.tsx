import React from 'react';

import Spline from '@splinetool/react-spline/next';

export const Hero = () => {
  return (
    <div className='overflow-hidden'>
      <Spline
        className='min-h-screen scale-125 overflow-hidden'
        scene='https://prod.spline.design/01zhE8ANpjC3Thqv/scene.splinecode'
      />
    </div>
  );
};
