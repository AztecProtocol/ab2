import React from 'react';

export const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-6 w-6">
      <div className="relative">
        <div className="w-6 h-6 border-2 border-red-500 border-solid rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-6 h-6 border-2 border-transparent border-t-red-500 rounded-full animate-spin-slow"></div>
      </div>
    </div>
  );
};
