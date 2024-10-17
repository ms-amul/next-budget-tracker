"use client";

import Header from "@/components/Header";
import { SessionProvider } from "next-auth/react";
import { ConfigProvider, theme } from "antd";

const SessionProviderWrapper = ({ children }) => {
  return (
    <SessionProvider>
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <div className="gradient" />
        <Header />
        <div className="min-h-screen md:px-16">
          <main className="">{children}</main>
        </div>
        <p className="text-center text-slate-200 text-lg mt-3 p-4">Made with ❤️ by @RAJGOPAL HOTA</p>
      </ConfigProvider>
    </SessionProvider>
  );
};

export default SessionProviderWrapper;
