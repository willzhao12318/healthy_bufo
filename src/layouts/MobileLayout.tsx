import { CalendarFilled, OpenAIFilled, SettingFilled } from "@ant-design/icons";
import { theme } from "antd";
import React, { useState } from "react";

type MobileLayoutProps = {
  children: React.ReactNode;
};

export default function MobileLayout({ children }: MobileLayoutProps) {
  const {
    token: { colorBgContainer, colorBorder, colorBgLayout },
  } = theme.useToken();
  const [activeKey, setActiveKey] = useState("chat");

  const tabs = [
    {
      key: "chat",
      title: "聊天",
      icon: <OpenAIFilled style={{ fontSize: "24px" }} />,
    },
    {
      key: "calendar",
      title: "我的预订",
      icon: <CalendarFilled style={{ fontSize: "24px" }} />,
    },
    {
      key: "settings",
      title: "设置",
      icon: <SettingFilled style={{ fontSize: "24px" }} />,
    },
  ];

  const currentTab = tabs.find((tab) => tab.key === activeKey);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: colorBgContainer }}>
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
              color: item.key === activeKey ? "#1677ff" : "inherit",
              cursor: "pointer",
            }}
            onClick={() => setActiveKey(item.key)}
          >
            {item.icon}
            <span style={{ fontSize: "12px", marginTop: "4px" }}>{item.title}</span>
          </div>
        ))}
      </footer>
    </div>
  );
}
