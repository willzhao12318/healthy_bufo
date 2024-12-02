import { Layout, Menu, MenuProps, theme, Button, Space } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import React, { useMemo } from "react";
import { CalendarFilled, MessageFilled, SettingFilled, TranslationOutlined, BulbOutlined } from "@ant-design/icons";
import { AppCurrentPage, useAppStore } from "@/hooks/appStore";
import { useTranslation } from "react-i18next";
import { useConfigStore } from "@/hooks/configStore";

type DesktopLayoutProps = {
  children: React.ReactNode;
};

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  const {
    token: { colorBgContainer, colorInfoBg },
  } = theme.useToken();

  const { setCurrentPage } = useAppStore();

  const { t, i18n } = useTranslation();
  const { getConfig, setLocale, setTheme } = useConfigStore();
  const config = getConfig();

  const siderItems: MenuProps["items"] = useMemo(
    () => [
      {
        key: AppCurrentPage.Chat,
        icon: <MessageFilled style={{ fontSize: "24px" }} />,
        label: t("chat"),
      },
      {
        key: AppCurrentPage.Orders,
        icon: <CalendarFilled style={{ fontSize: "24px" }} />,
        label: t("order"),
      },
      {
        key: AppCurrentPage.Setting,
        icon: <SettingFilled style={{ fontSize: "24px" }} />,
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
        border: `1px solid ${colorInfoBg}`,
      }}
      hasSider
    >
      <Sider
        width={200}
        style={{
          backgroundColor: colorInfoBg,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ margin: "16px", height: "32px", borderRadius: "6px", background: "#1677ff" }} />
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
            gap: "12px",
          }}
          items={siderItems}
          onClick={(item) => {
            setCurrentPage(item.key as AppCurrentPage);
          }}
        />

        <Space
          style={{
            padding: "16px",
            display: "flex",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <Button
            icon={<TranslationOutlined />}
            onClick={() => {
              const newLocale = i18n.language === "zh-CN" ? "en-US" : "zh-CN";
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
        </Space>
      </Sider>
      <Layout>
        <Content style={{ backgroundColor: colorBgContainer, padding: "16px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
