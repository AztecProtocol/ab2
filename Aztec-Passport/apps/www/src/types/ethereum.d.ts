import type { wagmiConfig } from '~/lib/viem';

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}
