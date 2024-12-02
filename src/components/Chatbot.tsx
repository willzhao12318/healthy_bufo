import bufo from "@/assets/bufo.gif";
import { Bubble, Prompts, Sender, Welcome, useXAgent, useXChat } from "@ant-design/x";
import React from "react";
import Image from "next/image";

import { FireOutlined, GiftOutlined } from "@ant-design/icons";
import { type GetProp, Layout, Space, theme } from "antd";
import { useTranslation } from "react-i18next";
import { Content } from "antd/es/layout/layout";
import categorize from "@/client/endpoints/request_categorization";
// import {categorizeInput} from "@/pages/api/request_categorization";

const roles: GetProp<typeof Bubble.List, "roles"> = {
  ai: {
    placement: "start",
    typing: { step: 5, interval: 20 },
    styles: {
      content: {
        borderRadius: 16,
      },
    },
  },
  local: {
    placement: "end",
    variant: "shadow",
  },
};

export default function ChatBot() {
  const { t } = useTranslation();
  const {
    token: { boxShadow, colorBgContainer, colorPrimary, sizeMS },
  } = theme.useToken();
  const [content, setContent] = React.useState("");

  // ==================== Runtime ====================
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess }) => {
      if (!message){
        onSuccess("Please tell me what you need");
        return;
      }
      try{
        const result = await categorize(message);
        onSuccess(result.category.toString());
      }catch(e){
        console.error(e);
        onSuccess("Something went wrong");
      }
    },
  });

  const { onRequest, messages } = useXChat({
    agent,
  });

  // ==================== Event ====================
  const onSubmit = (nextContent: string) => {
    if (!nextContent) return;
    onRequest(nextContent);
    setContent("");
  };

  const onPromptsItemClick: GetProp<typeof Prompts, "onItemClick"> = (info) => {
    onRequest(info.data.description as string);
  };


  // ==================== Nodes ====================
  const placeholderNode = (
    <Space direction="vertical" size={sizeMS}>
      <Welcome
        variant="borderless"
        icon={<Image src={bufo.src} alt="bufo" width={64} height={64} />}
        title={t("chatbotTitle")}
        description={t("chatbotDescription")}
      />
      <Prompts
        items={[
          {
            key: "placeholder_prompts",
            label: (
              <Space align="start">
                <FireOutlined style={{ color: colorPrimary }} />
                <span>{t("recommend")}</span>
              </Space>
            ),
            description: t("recommendDescription"),
            children: [
              {
                key: "analyze_dishes",
                description: t("analyzeDishes"),
              },
              {
                key: "weekly_dishes",
                description: t("weeklyDishes"),
              },
              {
                key: "recommend_dishes",
                description: t("recommendDishes"),
              },
            ],
          },
        ]}
        styles={{
          list: {
            width: "100%",
          },
          item: {
            flex: 1,
          },
        }}
        onItemClick={onPromptsItemClick}
      />
    </Space>
  );

  const items: GetProp<typeof Bubble.List, "items"> = messages.map(({ id, message, status }) => ({
    key: id,
    loading: status === "loading",
    role: status === "local" ? "local" : "ai",
    content: message,
  }));

  // ==================== Render =================
  return (
    <Layout
      style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", background: colorBgContainer }}
    >
      <Content
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: sizeMS
        }}
      >
        <Bubble.List
          items={items.length > 0 ? items : [{ content: placeholderNode, variant: "borderless" }]}
          roles={roles}
          style={{ flex: 1 }}
        />
        <Prompts
          items={[
            {
              key: "analyze_dishes",
              description: t("analyzeDishes"),
              icon: <GiftOutlined style={{ color: colorPrimary }} />,
            },
          ]}
          onItemClick={onPromptsItemClick}
        />
        <Sender
          value={content}
          onSubmit={onSubmit}
          onChange={setContent}
          loading={agent.isRequesting()}
          style={{ boxShadow: boxShadow }}
        />
      </Content>
    </Layout>
  );
}
