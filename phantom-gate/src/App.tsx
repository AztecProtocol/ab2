import React, { useEffect, useState } from 'react'
import { createPXEClient, waitForPXE } from '@aztec/aztec.js'
import { WalletInteractions } from './components/WalletInteractions.js'
import { RPC_URL } from './constants.js'
import { Toaster } from 'react-hot-toast'

function App() {
  // const setPXEClient = useSetAtom(pxeAtom)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  useEffect(() => {
    setErrorMessage('')
    setIsLoading(true)
    const pxeClient = createPXEClient(RPC_URL)
    waitForPXE(pxeClient)
      // .then((_) => setPXEClient(pxeClient))
      .catch((error) => {
        setErrorMessage(error.toString())
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])
  return (
    <div className="flex justify-center items-center h-screen w-screen flex-col">
      {isLoading && <h1> Loading ....</h1>}
      {errorMessage && <h2 className="text-red-600">{errorMessage}</h2>}
      {!isLoading && !errorMessage && <WalletInteractions />}
      <Toaster />
    </div>
  )
}

export default App