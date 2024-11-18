'use client';

import type { PropsWithChildren } from 'react';

import { projectId, wagmiConfig } from '~/lib/viem';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { type State, WagmiProvider } from 'wagmi';

createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
  themeMode: 'light',
});

const queryClient = new QueryClient();

interface Web3ProviderProps extends PropsWithChildren {
  initialState?: State;
}

export const Web3Provider = ({ children, initialState }: Web3ProviderProps) => {
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
