import {
  type Config,
  cookieStorage,
  createConfig,
  createStorage,
  http,
} from 'wagmi';
import { anvil } from 'wagmi/chains';
import { walletConnect } from 'wagmi/connectors';

import PASSPORT_CONFIG from '../../../config.json';
import { MOCK_ENS_ABI, PASSPORT_ABI } from './abi';

export const projectId = import.meta.env.VITE_WALLETCONNECT_ID;

const metadata = {
  name: 'Web3 Turbo Starter',
  description: 'Web3 starter kit with turborepo, wagmi, and Next.js',
  url: 'http://localhost:3000',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

export const wagmiConfig: Config = createConfig({
  chains: [anvil],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  connectors: [walletConnect({ projectId, metadata, showQrModal: false })],
  transports: {
    [anvil.id]: http(),
  },
});

export const passportConfig = {
  address: PASSPORT_CONFIG.PORTAL_L1_ADDRESS as `0x${string}`,
  abi: PASSPORT_ABI,
};

export const mockEnsConfig = {
  address: PASSPORT_CONFIG.MOCK_ENS_ADDRESS as `0x${string}`,
  abi: MOCK_ENS_ABI,
};
