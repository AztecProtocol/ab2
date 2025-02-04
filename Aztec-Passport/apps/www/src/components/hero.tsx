import React from 'react';

import Spline from '@splinetool/react-spline';

export const Hero = () => {
  return (
    <div className='overflow-hidden'>
      <Spline
        className='max-h-screen min-h-screen scale-125 overflow-hidden'
        scene='https://prod.spline.design/01zhE8ANpjC3Thqv/scene.splinecode'
      />
    </div>
  );
};
