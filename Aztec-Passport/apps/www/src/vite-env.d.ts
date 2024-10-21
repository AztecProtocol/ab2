/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WALLETCONNECT_ID: string;
  readonly VITE_PXE_URL: string;
  readonly VITE_GOOGLE_OAUTH_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
