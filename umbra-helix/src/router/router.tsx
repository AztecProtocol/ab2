import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "sonner";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import React from "react";
import { AdminPanel } from "../components/AdminPanel.js";
import { ErrorView } from "../error-renderer/views/error.js";
import { PXE } from "@aztec/aztec.js";
import { VerifyWallet } from "../components/VerifyWallet.js";
import AppLayout from "../components/AppLayout.js";



export const Router = ({
  isLoading,
  pxe,
  errorMessage
}: {
  isLoading: boolean;
  pxe: PXE | undefined;
  errorMessage: string
}) => {

  return (
    <ErrorBoundary FallbackComponent={ErrorView}>
      <BrowserRouter>
        <AppLayout pxe={pxe} isLoading={isLoading} errorMessage={errorMessage}>
          <Routes>
            <Route path="/verify" element={<VerifyWallet pxe={pxe!} />} />
            <Route path="/admin" element={<AdminPanel pxe={pxe!} />} />
            <Route path="/" element={<Navigate to="/admin" replace />} />
          </Routes>
        </AppLayout>
        <Toaster position="top-right" theme="dark" />
      </BrowserRouter>
    </ErrorBoundary >
  );
};
