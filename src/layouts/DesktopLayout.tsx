import { Layout, Menu, MenuProps, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import React from "react";
import { CalendarFilled, OpenAIFilled, SettingFilled } from "@ant-design/icons";

const siderItems: MenuProps["items"] = [
  {
    key: "chat",
    icon: <OpenAIFilled style={{ fontSize: "24px" }} />,
    label: "聊天",
  },
  {
    key: "calendar",
    icon: <CalendarFilled style={{ fontSize: "24px" }} />,
    label: "我的预订",
  },
  {
    key: "settings",
    icon: <SettingFilled style={{ fontSize: "24px" }} />,
    label: "设置",
  },
];

type DesktopLayoutProps = {
  children: React.ReactNode;
};

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  const {
    token: { colorBgContainer, colorInfoBg },
  } = theme.useToken();

  return (
    <Layout
      style={{
        height: "90vh",
        width: "90vw",
        borderRadius: "20px",
        backgroundColor: colorBgContainer,
        overflow: "hidden",
        border: `1px solid ${colorInfoBg}`,
      }}
      hasSider
    >
      <Sider width={200} style={{ backgroundColor: colorInfoBg, alignItems: "center" }}>
        <div style={{ margin: "16px", height: "32px", borderRadius: "6px", background: "#1677ff" }} />
        <Menu
          defaultSelectedKeys={["chat"]}
          defaultOpenKeys={["chat"]}
          mode="inline"
          style={{
            height: "100%",
            backgroundColor: colorInfoBg,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
          items={siderItems}
        />
      </Sider>
      <Layout>
        <Content style={{ backgroundColor: colorBgContainer }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
