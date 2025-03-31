"use client";

import Header from "@/components/Header";
import { SessionProvider } from "next-auth/react";
import { ConfigProvider, theme } from "antd";

const SessionProviderWrapper = ({ children }) => {
  return (
    <SessionProvider>
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <div className="gradient" />
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex-1 flex items-center justify-center px-4 md:px-16">
            <main className="w-full">{children}</main>
          </div>
          <p className="text-center text-slate-500 text-md p-4 font-semibold">
            Made with ❤️ by{" "}
            <a href="https://rajgopal.in/" target="_blank">
              @RAJGOPAL HOTA
            </a>
          </p>
        </div>
      </ConfigProvider>
    </SessionProvider>
  );
};

export default SessionProviderWrapper;
