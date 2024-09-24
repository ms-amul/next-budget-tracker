"use client";

import Header from "@/components/Header";
import { SessionProvider } from "next-auth/react";

const SessionProviderWrapper = ({ children }) => {
  return (
    <SessionProvider>
      <div className="gradient" />
      <Header />
      <div className="min-h-screen">
        <main className="mt-16">{children}</main>
      </div>
    </SessionProvider>
  );
};

export default SessionProviderWrapper;
