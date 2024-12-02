import { AppCurrentPage, useAppStore } from "@/hooks/appStore";
import { CalendarFilled, MessageFilled, SettingFilled } from "@ant-design/icons";
import { theme } from "antd";
import React from "react";

type MobileLayoutProps = {
  children: React.ReactNode;
};

export default function MobileLayout({ children }: MobileLayoutProps) {
  const {
    token: { colorBgContainer, colorBorder, colorBgLayout },
  } = theme.useToken();

  const { currentPage, setCurrentPage } = useAppStore();
  
  const tabs = [
    {
      key: AppCurrentPage.Chat,
      title: "聊天",
      icon: <MessageFilled style={{ fontSize: "24px" }} />,
    },
    {
      key: AppCurrentPage.Orders,
      title: "我的预订",
      icon: <CalendarFilled style={{ fontSize: "24px" }} />,
    },
    {
      key: AppCurrentPage.Setting,
      title: "设置",
      icon: <SettingFilled style={{ fontSize: "24px" }} />,
    },
  ];

  const currentTab = tabs.find((tab) => tab.key === currentPage);

  return (
    <div style={{ 
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
      <header
        style={{
          height: "60px",
          lineHeight: "60px",
          textAlign: "center",
          borderBottom: `1px solid ${colorBorder}`,
          backgroundColor: colorBgLayout,
        }}
      >
        {currentTab?.title}
      </header>
      <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
      <footer
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
      </footer>
    </div>
  );
}
