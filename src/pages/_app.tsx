import "@/styles/globals.css";
import "@/i18n/i18n";

import React from "react";
import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import theme from "@/theme/themeConfig";
import MobileLayout from "@/layouts/MobileLayout";
import DesktopLayout from "@/layouts/DesktopLayout";
const MediaQuery = dynamic(() => import("react-responsive"), {
  ssr: false,
});

const App = ({ Component, pageProps }: AppProps) => (
  <ConfigProvider theme={theme}>
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

export default App;
