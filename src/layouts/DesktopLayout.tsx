import { Layout, Menu, MenuProps, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import React from "react";
import { CalendarFilled, MessageFilled, SettingFilled } from "@ant-design/icons";
import { AppCurrentPage, useAppStore } from "@/hooks/appStore";

const siderItems: MenuProps["items"] = [
  {
    key: AppCurrentPage.Chat,
    icon: <MessageFilled style={{ fontSize: "24px" }} />,
    label: "聊天",
  },
  {
    key: AppCurrentPage.Orders,
    icon: <CalendarFilled style={{ fontSize: "24px" }} />,
    label: "我的预订",
  },
  {
    key: AppCurrentPage.Setting,
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

  const { setCurrentPage } = useAppStore();

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
          defaultSelectedKeys={[AppCurrentPage.Chat]}
          defaultOpenKeys={[AppCurrentPage.Chat]}
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
          onClick={(item) => {
            setCurrentPage(item.key as AppCurrentPage);
          }}
        />
      </Sider>
      <Layout>
        <Content style={{ backgroundColor: colorBgContainer, padding: "16px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
