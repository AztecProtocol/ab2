'use client';

import React, { type PropsWithChildren } from 'react';

import { ZkEmailSDKProvider } from '@zk-email/zk-email-sdk';
import { env } from '~/env';

export const ZKEmailProvider = ({ children }: PropsWithChildren) => {
  return (
    <ZkEmailSDKProvider
      clientId={env.NEXT_PUBLIC_GOOGLE_OAUTH_ID}
      zkEmailSDKRegistryUrl='https://registry-dev.zkregex.com'
    >
      {children}
    </ZkEmailSDKProvider>
  );
};
