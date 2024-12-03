import bufo from "@/assets/bufo.gif";
import { Bubble, Prompts, Sender, Welcome, useXAgent, useXChat } from "@ant-design/x";
import React from "react";
import Image from "next/image";

import {FireOutlined, GiftOutlined, UserOutlined} from "@ant-design/icons";
import {type GetProp, Layout, Space, Spin, theme} from "antd";
import { useTranslation } from "react-i18next";
import { Content } from "antd/es/layout/layout";
import categorize from "../client/endpoints/request_categorization";
import {t} from "i18next";
import {MessageInfo} from "@ant-design/x/es/useXChat";
import analyze from "../client/endpoints/request_analyze";
import {RoleType} from "@ant-design/x/es/bubble/BubbleList";

const roles: Record<string, RoleType> = {
  ai: {
    placement: 'start',
    avatar: {
      icon: <Image src={bufo.src} alt="bufo" width={64} height={64} />,
      style: {
        background: '#fde3cf',
      },
    },
    typing: {
      step: 5,
      interval: 20,
    },
    style: {
      maxWidth: 600,
      marginInlineEnd: 44,
    },
    styles: {
      footer: {
        width: '100%',
      },
    },
    loadingRender: () => (
        <Space>
          <Spin size="small" />
          {t("working")}
        </Space>
    ),
  },
  local: {
    placement: 'end',
    avatar: {
      icon: <UserOutlined />,
      style: {
        background: '#87d068',
      },
    },
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
      const newMessage: MessageInfo<string> = {
        id: Date.now(),
        message: "",
        status: 'loading',
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);

      try {
        // const result = { category: 2 };
        const result = await categorize(message);
        console.log(result);
        if(result.category === 2) {
          const response = await analyze(message);
          const analyzeResult = response.analyzeResult;
          if (analyzeResult.length === 0) {
            setMessages(prevMessages => prevMessages.slice(0, -1));
            onSuccess(t("noAnalysisResult"));
          }
          const htmlString = analyzeResult.map(item => `
            <div>
            <b>${item.name}</b><br/>
            <p>蛋白质(Protein): ${item.protein}g</p>
            <p>脂肪(Fat): ${item.fat}g</p>
            <p>碳水(Carbohydrate): ${item.carbohydrate}g</p>
            <p>健康指数(Health Score): ${item.healthIndex}</p>
            <p>健康分析(Health Tips): ${item.healthAnalysis}</p>
            <p>卡路里(Calories): ${item.calories}</p>
            </div>`).join("");
          setMessages(prevMessages => prevMessages.slice(0, -1));
          onSuccess(htmlString);
        }
        else if(result.category === 3) {
          setMessages(prevMessages => prevMessages.slice(0, -1));
          onSuccess(result.text || t("invalidCategory"));

        }
        else {
          setMessages(prevMessages => prevMessages.slice(0, -1));
          onSuccess(t("invalidCategory"));
        }
      } catch {
        setMessages(prevMessages => prevMessages.slice(0, -1));
        onSuccess(t("error"));
      }
    },
  });

  const { onRequest, messages, setMessages } = useXChat({
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
    content: <div dangerouslySetInnerHTML={{__html: message}}/>,
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
