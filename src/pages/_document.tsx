import React, { useEffect, useLayoutEffect, useState } from "react";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import Document, { Head, Html, Main, NextScript } from "next/document";
import type { DocumentContext } from "next/document";
import { theme } from "antd";
import { useMediaQuery } from "react-responsive";

const MyDocument = () => {
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [bodyStyle, setBodyStyle] = useState({});
  const mobileBodyStyle = {
    backgroundColor: colorBgLayout,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    margin: 0,
  };

  const desktopBodyStyle = {
    backgroundColor: colorBgLayout,
    height: "100vh",
    width: "100vw",
    display: "flex",
    margin: 0,
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
    userSelect: "none" as const,
    touchAction: "pan-x pan-y",
    overflow: "hidden",
  };

  return (
    <Html lang="zh-Hans">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) =>
        (
          <StyleProvider cache={cache}>
            <App {...props} />
          </StyleProvider>
        ),
    });

  const initialProps = await Document.getInitialProps(ctx);
  const style = extractStyle(cache, true);
  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <style dangerouslySetInnerHTML={{ __html: style }} />
      </>
    ),
  };
};

export default MyDocument;
