import type { ComponentProps } from 'react';

export interface PageProps extends ComponentProps<'div'> {
  index: number;
  currentPage: number;
  totalPages: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

export interface Service {
  service:
    | 'x'
    | 'balance'
    | 'github'
    | 'google'
    | 'linkedin'
    | 'biometric'
    | 'ens'
    | 'vc';
  address: `0x${string}`;
  weight: number;
  maxScore: number;
  baseScore: number;
}
