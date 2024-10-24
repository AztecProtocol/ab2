import { ErrorBoundary } from 'react-error-boundary'
import { Toaster } from 'sonner'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import React from 'react'
import { WalletInteractions } from '../components/WalletInteractions.js'
import { ErrorView } from '../error-renderer/views/error.js'
import { CreateWallet } from '../components/create-wallet.js'
import { PXE } from '@aztec/aztec.js'


const Loading = () => (<h1>Hello</h1>)

export const Router = ({ isLoading, pxe }: { isLoading: boolean, pxe: PXE }) => {
  // const shareData = useAppStore((state) => state.shareData);
  return (
    <ErrorBoundary FallbackComponent={ErrorView}>
      <div className="flex flex-1 pointer">
        <div>{isLoading && 'loading'}</div>
        <Toaster theme="dark" />
        <MemoryRouter>
          <Routes>
            {/* <Route path="/" element={<Hello />} /> */}
            {!isLoading && <Route path="/" element={<WalletInteractions pxe={pxe} />} />}
            {/* <Route path="/" element={<CreateWallet />} /> */}
            {/* <Route path="/wallet-interaction" element={<WalletInteractions />} /> */}
          </Routes>
        </MemoryRouter>
      </div>
    </ErrorBoundary>
  )
}
