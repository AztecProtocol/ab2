import React from 'react';
import { Spinner } from './Spinnner.js';
import Header from './Header.js';
import { PXE } from '@aztec/aztec.js';

const AppLayout = ({ pxe, children, isLoading, errorMessage }: {
  pxe?: PXE,
  children: React.ReactNode,
  isLoading: boolean,
  errorMessage: string
}) => {

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner />
          <p className="text-gray-600">Initializing PXE...</p>
        </div>
      </div>
    );
  }
  if (errorMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6">
          <h2 className="text-xl font-bold text-red-600">Initialization Error</h2>
          <p className="mt-2">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header pxe={pxe!} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;