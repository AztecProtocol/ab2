import React, { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { pxeAtom } from "./atoms.js";
import { createPXEClient, PXE, waitForPXE } from "@aztec/aztec.js";
import { RPC_URL } from "./constants.js";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";
import { Router } from "./router/router.js";

function App() {
  const setPXEClient = useSetAtom(pxeAtom);
  const [pxeLocal, setPXELocal] = useState<PXE>()
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    setErrorMessage("");
    setIsLoading(true);
    const pxeClient = createPXEClient(RPC_URL);
    waitForPXE(pxeClient)
      .then((_) => {
        setPXEClient(pxeClient)
        setPXELocal(pxeClient)
      })
      .catch((error) => {
        setErrorMessage(error.toString());
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    // <div className="flex justify-center items-center h-screen w-screen flex-col">
    //   <h1 className="text-4xl font-bold text-blue-600">Aztec Starter</h1>
    //   {isLoading && <h1> Loading ....</h1>}
    //   {errorMessage && <h2 className="text-red-600">{errorMessage}</h2>}

    //   {!isLoading && !errorMessage && <WalletInteractions />}
    //   <Toaster />
    // </div>
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {errorMessage && <h2 className="text-red-600">{errorMessage}</h2>}
        <Router isLoading={isLoading} pxe={pxeLocal} errorMessage={errorMessage} />
      </ThemeProvider>
      <Toaster />
    </>
  );
}

export default App;
