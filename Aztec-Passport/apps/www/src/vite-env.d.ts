/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WALLETCONNECT_ID: string;
  readonly VITE_PXE_URL: string;
  readonly VITE_GOOGLE_OAUTH_ID: string;
  readonly VITE_PASSPORT_ADDRESS: string;
  readonly VITE_X_MODULE_ADDRESS: string;
  readonly VITE_GITHUB_MODULE_ADDRESS: string;
  readonly VITE_GOOGLE_MODULE_ADDRESS: string;
  readonly VITE_LINKEDIN_MODULE_ADDRESS: string;
  readonly VITE_VERIFIABLE_CREDENTIAL_MODULE_ADDRESS: string;
  readonly VITE_ENS_MODULE_ADDRESS: string;
  readonly VITE_BALANCE_MODULE_ADDRESS: string;
  readonly VITE_BIOMETRIC_MODULE_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
