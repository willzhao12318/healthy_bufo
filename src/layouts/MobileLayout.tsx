import { AppCurrentPage, useAppStore } from "@/hooks/appStore";
import { CalendarFilled, MessageFilled, SettingFilled } from "@ant-design/icons";
import { Layout, theme } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

type MobileLayoutProps = {
  children: React.ReactNode;
};

export default function MobileLayout({ children }: MobileLayoutProps) {
  const {
    token: { colorBgContainer, colorBorder, colorBgLayout },
  } = theme.useToken();

  const { currentPage, setCurrentPage } = useAppStore();
  const { t } = useTranslation();
  const tabs = useMemo(() => [
    {
      key: AppCurrentPage.Chat,
      title: t("chat"),
      icon: <MessageFilled style={{ fontSize: "24px" }} />,
    },
    {
      key: AppCurrentPage.Orders,
      title: t("order"),
      icon: <CalendarFilled style={{ fontSize: "24px" }} />,
    },
    {
      key: AppCurrentPage.Setting,
      title: t("setting"),
      icon: <SettingFilled style={{ fontSize: "24px" }} />,
    },
  ], [t]);

  const currentTab = tabs.find((tab) => tab.key === currentPage);

  return (
    <Layout style={{ 
      height: '100vh',
      maxHeight: '-webkit-fill-available',
      display: "flex", 
      flexDirection: "column", 
      backgroundColor: colorBgContainer,
      position: 'fixed',
      width: '100%',
      top: 0,
      left: 0,
      overflow: 'hidden'
    }}>
      <Header
        style={{
          height: "60px",
          lineHeight: "60px",
          textAlign: "center",
          borderBottom: `1px solid ${colorBorder}`,
          backgroundColor: colorBgLayout,
        }}
      >
        {currentTab?.title}
      </Header>
      <Content style={{ flex: 1, overflowY: "auto", padding: "16px" }}>{children}</Content>
      <Footer
        style={{
          height: "60px",
          display: "flex",
          borderTop: `1px solid ${colorBorder}`,
          backgroundColor: colorBgLayout,
        }}
      >
        {tabs.map((item) => (
          <div
            key={item.key}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: item.key === currentPage ? "#1677ff" : "inherit",
              cursor: "pointer",
            }}
            onClick={() => setCurrentPage(item.key)}
          >
            {item.icon}
            <span style={{ fontSize: "12px", marginTop: "4px" }}>{item.title}</span>
          </div>
        ))}
      </Footer>
    </Layout>
  );
}
