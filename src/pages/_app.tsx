import "@/styles/globals.css";
import "@/i18n/i18n";

import React from "react";
import { ConfigProvider, theme as antTheme } from "antd";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import MobileLayout from "@/layouts/MobileLayout";
import DesktopLayout from "@/layouts/DesktopLayout";
import { useConfigStore } from "@/hooks/configStore";
const MediaQuery = dynamic(() => import("react-responsive"), {
  ssr: false,
});

const App = ({ Component, pageProps }: AppProps) => {
  const { theme } = useConfigStore();
  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 16,
        },
        algorithm: theme !== undefined && theme === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
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

export default App;
