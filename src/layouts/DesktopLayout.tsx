import bufo from "@/assets/bufo-juice.png";
import { Layout, Menu, MenuProps, theme, Button, Space, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import React, { useMemo, useState } from "react";
import { CalendarFilled, MessageFilled, SettingFilled, TranslationOutlined, BulbOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { AppCurrentPage, useAppStore } from "@/hooks/appStore";
import { useTranslation } from "react-i18next";
import { useConfigStore } from "@/hooks/configStore";
import Image from "next/image";

type DesktopLayoutProps = {
  children: React.ReactNode;
};

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  const {
    token: { colorBgContainer, colorInfoBg, paddingSM, sizeMS, boxShadow, colorBorder },
  } = theme.useToken();

  const { setCurrentPage } = useAppStore();

  const { t, i18n } = useTranslation();
  const { getConfig, setLocale, setTheme } = useConfigStore();
  const config = getConfig();
  const [collapsed, setCollapsed] = useState(false);

  const siderItems: MenuProps["items"] = useMemo(
    () => [
      {
        key: AppCurrentPage.Chat,
        icon: <MessageFilled />,
        label: t("chat"),
      },
      {
        key: AppCurrentPage.Orders,
        icon: <CalendarFilled />,
        label: t("order"),
      },
      {
        key: AppCurrentPage.Setting,
        icon: <SettingFilled />,
        label: t("setting"),
      },
    ],
    [t]
  );

  return (
    <Layout
      style={{
        height: "90vh",
        width: "90vw",
        borderRadius: "20px",
        backgroundColor: colorBgContainer,
        overflow: "hidden",
        border: `1px solid ${colorBorder}`,
        boxShadow: boxShadow,
      }}
      hasSider
    >
      <Sider
        width={200}
        collapsible
        collapsed={collapsed}
        trigger={null}
        style={{
          backgroundColor: colorInfoBg,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Space style={{ paddingLeft: "8px", paddingTop: "16px" }}>
          <Image src={bufo.src} alt="logo" width={48} height={48} />
          {!collapsed && <Typography.Title level={4} style={{ margin: 0 }}>
            {t("chatbotTitle")}
          </Typography.Title>}
        </Space>
        <Menu
          defaultSelectedKeys={[AppCurrentPage.Chat]}
          defaultOpenKeys={[AppCurrentPage.Chat]}
          mode="inline"
          style={{
            flex: 1,
            backgroundColor: colorInfoBg,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: `${sizeMS}px`,
          }}
          items={siderItems}
          onClick={(item) => {
            setCurrentPage(item.key as AppCurrentPage);
          }}
        />

        <Space
          direction={collapsed ? "vertical" : "horizontal"}
          style={{
            padding: `${paddingSM}px`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: `${sizeMS}px`,
          }}
        >
          <Button
            icon={<TranslationOutlined />}
            onClick={() => {
              const newLocale = i18n.language === "zh" ? "en" : "zh";
              i18n.changeLanguage(newLocale);
              setLocale(newLocale);
            }}
          />
          <Button
            icon={<BulbOutlined />}
            onClick={() => {
              const newTheme = config.theme === "light" ? "dark" : "light";
              setTheme(newTheme);
            }}
          />
          <Button
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
        </Space>
      </Sider>
      <Layout>
        <Content style={{ backgroundColor: colorBgContainer, padding: "16px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
