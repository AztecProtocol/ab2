import type { ComponentProps } from 'react';

export interface PageProps extends ComponentProps<'div'> {
  index: number;
  currentPage: number;
  totalPages: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}
