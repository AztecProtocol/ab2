import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Web3Provider, ZKEmailProvider } from '~/providers';

import { Toaster } from '~/components/ui/sonner';

const RootComponent = () => {
  return (
    <Web3Provider>
      <ZKEmailProvider>
        <Outlet />
        <Toaster />
        <TanStackRouterDevtools position='bottom-right' />
      </ZKEmailProvider>
    </Web3Provider>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
