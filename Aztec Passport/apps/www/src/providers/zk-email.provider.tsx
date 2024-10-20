'use client';

import dynamic from 'next/dynamic';

import React, { type PropsWithChildren } from 'react';

import { env } from '~/env';

const ZkEmailSDKProvider = dynamic(
  () => import('@zk-email/zk-email-sdk').then((mod) => mod.ZkEmailSDKProvider),
  {
    ssr: false,
  }
);

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
