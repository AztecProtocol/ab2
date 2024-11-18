'use client';

import React, { type PropsWithChildren } from 'react';

import { ZkEmailSDKProvider } from '@zk-email/zk-email-sdk';


export const ZKEmailProvider = ({ children }: PropsWithChildren) => {
  return (
    <ZkEmailSDKProvider
      clientId={import.meta.env.VITE_GOOGLE_OAUTH_ID}
      zkEmailSDKRegistryUrl='https://registry-dev.zkregex.com'
    >
      {children}
    </ZkEmailSDKProvider>
  );
};
