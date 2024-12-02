"use client";
import "@/styles/globals.css";
import "@/i18n/i18n";

import React, { Suspense } from "react";
import { ConfigProvider, Spin, theme as antTheme } from "antd";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import MobileLayout from "@/layouts/MobileLayout";
import DesktopLayout from "@/layouts/DesktopLayout";
import { useConfigStore } from "@/hooks/configStore";
const MediaQuery = dynamic(() => import("react-responsive"), {
  ssr: false,
});

const AppContainer = ({ Component, pageProps }: AppProps) => {
  const { theme } = useConfigStore();
  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 16,
        },
        components: {
          Menu: {
            collapsedIconSize: 30,
            collapsedWidth: 100,
            iconSize: 24,
          },
        },
        algorithm: theme === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
      }}
    >
      <MediaQuery maxWidth={767}>
        <MobileLayout>
          <Component {...pageProps} />
        </MobileLayout>
      </MediaQuery>
      <MediaQuery minWidth={768}>
        <DesktopLayout>
          <Component {...pageProps} />
        </DesktopLayout>
      </MediaQuery>
    </ConfigProvider>
  );
};

const App = (props: AppProps) => {
  return (
    <Suspense fallback={<Spin fullscreen size="large"/>}>
      <AppContainer {...props} />
    </Suspense>
  );
};

export default App;
