import bufo from "@/assets/bufo.gif";
import { Bubble, Prompts, Sender, Welcome, useXAgent, useXChat } from "@ant-design/x";
import React, {useEffect} from "react";
import Image from "next/image";

import {FireOutlined, GiftOutlined, UserOutlined} from "@ant-design/icons";
import {type GetProp, Layout, Space, Spin, theme} from "antd";
import { useTranslation } from "react-i18next";
import { Content } from "antd/es/layout/layout";
import {t} from "i18next";
import {MessageInfo} from "@ant-design/x/es/useXChat";
import analyze from "../client/endpoints/request_analyze";
import {RoleType} from "@ant-design/x/es/bubble/BubbleList";
import categorize from "@/client/endpoints/request_categorization";
import {Category, MealPlan, WeekDay} from "@/utils/type";
import {recommend} from "@/pages/api/recommend";

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

const mockMealPlan: MealPlan = {
  dateList: [
    {
      weekDay: WeekDay.Monday,
      breakfast: [
        {
          id: "BSK001",
          chineseName: "煎饼",
          englishName: "Pancakes",
          restaurant: {
            id: "RST001",
            name: "Sunny Side Cafe"
          }
        },
        {
          id: "BSK002",
          chineseName: "油条",
          englishName: "Churro",
          restaurant: {
            id: "RST002",
            name: "Rainy Side Cafe"
          }
        }
      ],
      lunch: [
        {
          id: "LCH001",
          chineseName: "藜麦沙拉",
          englishName: "Quinoa Salad",
          restaurant: {
            id: "RST003",
            name: "Green Bowl"
          }
        }
      ],
      afternoonTea: [
        {
          id: "AT001",
          chineseName: "果酱司康",
          englishName: "Scones with Jam",
          restaurant: {
            id: "RST004",
            name: "Tea Time"
          }
        }
      ]
    },
    {
      weekDay: WeekDay.Tuesday,
      breakfast: [
        {
          id: "BSK003",
          chineseName: "牛油果吐司",
          englishName: "Avocado Toast",
          restaurant: {
            id: "RST005",
            name: "Morning Brew"
          }
        }
      ],
      lunch: [
        {
          id: "LCH002",
          chineseName: "",
          englishName: "Spaghetti Carbonara",
          restaurant: {
            id: "RST006",
            name: "Pasta Palace"
          }
        }
      ],
      afternoonTea: [
        {
          id: "AT002",
          chineseName: "",
          englishName: "Chocolate Cake",
          restaurant: {
            id: "RST007",
            name: "Sweet Treats"
          }
        }
      ]
    },
    {
      weekDay: WeekDay.Wednesday,
      breakfast: [
        {
          id: "BSK004",
          chineseName: "健康碗",
          englishName: "Smoothie Bowl",
          restaurant:{
            id:"RST008",
            name:"Healthy Bites"
          }
        }
      ],
      lunch:[
        {
          id:"LCH003",
          chineseName:"芝士汉堡",
          englishName:"Cheeseburger",
          restaurant:{
            id:"RST009",
            name:"The Burger Joint"
          }
        }
      ],
      afternoonTea:[
        {
          id:"AT003",
          chineseName:"水果挞",
          englishName:"Fruit Tart",
          restaurant:{
            id:"RST010",
            name:"Cafe Delight"
          }
        }
      ]
    }
  ],
  previousRecommendation:{
    breakfast:[
      {
        weekDay: WeekDay.Monday,
        id:"BSK001",
        chineseName:"煎饼",
        englishName:"Pancakes",
        restaurant:{
          id:"RST001",
          name:"Sunny Side Cafe"
        }
      }
    ],
    lunch:[
      {
        weekDay: WeekDay.Tuesday,
        id:"LCH004",
        chineseName:"",
        englishName:"Tacos",
        restaurant:{
          id:"RST011",
          name:"Taco Town"
        }
      }
    ],
    afternoonTea:[
      {
        weekDay: WeekDay.Wednesday,
        id:"AT004",
        chineseName:"",
        englishName:"Croissant",
        restaurant:{
          id:'RST012',
          name:'Pastry Place'
        }
      }
    ]
  }
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
        const result = await categorize(message);
        switch (result.category) {
          case Category.CategoryMaliciousInput:
            setMessages(prevMessages => prevMessages.slice(0, -1));
            onSuccess(t("invalidCategory"));
            break;
          case Category.CategoryUnrelated:
            setMessages(prevMessages => prevMessages.slice(0, -1));
            onSuccess(t("invalidCategory"));
            break;
          case Category.CategoryRequestMenuRecommendation:
            const recommendResult = await recommend({userInput:message,mealPlan:mockMealPlan});
            if (!recommendResult) {
              setMessages(prevMessages => prevMessages.slice(0, -1));
              onSuccess(t("noRecommendResult"));
              break;
            }
            const breakfastList =  (recommendResult.breakfast.length > 0) ? recommendResult.breakfast.map(
              mealInfo=>`
            <div>
            <p>${mealInfo.emoji} ${t(mealInfo.weekDay.toString())}: ${mealInfo.dishName}</p>
            </div>`).join("") : t("noBreakfastOptions");
            const lunchList = (recommendResult.lunch.length > 0) ?  recommendResult.lunch.map( mealInfo=>`
            <div>
            <p>${mealInfo.emoji} ${t(mealInfo.weekDay.toString())}: ${mealInfo.dishName}</p>
            </div>`).join("") : t("noLunchOptions");
            const afternoonTeaList =(recommendResult.afternoonTea.length > 0) ?  recommendResult.afternoonTea.map( mealInfo=>`
            <div>
            <p>${mealInfo.emoji} ${t(mealInfo.weekDay.toString())}: ${mealInfo.dishName}</p>
            </div>`).join("") : t("noAfternoonTeaOptions");
            const recommendStr =
              `<div><b>${t("breakfastRecommend")}</b></div>` + "\n" + breakfastList + "\n"
              + `<div><b>${t("lunchRecommend")}</b></div>` + "\n" + lunchList+ "\n" +
              `<div><b>${t("afternoonTeaRecommend")}</b></div>` + "\n" + afternoonTeaList;
            setMessages(prevMessages => prevMessages.slice(0, -1));
            onSuccess(recommendStr);
            break;
          case Category.CategoryRequestNutritionAnalyze:
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
            <p>蛙蛙格言(Bufo Slogan): ${item.bufoSlogan}</p>
            </div>`).join("");
          setMessages(prevMessages => prevMessages.slice(0, -1));
          onSuccess(htmlString);
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

  useEffect(() => {
    if(messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      const parsedMessages: MessageInfo<string>[] = JSON.parse(savedMessages);
      setMessages(parsedMessages);
    }
  }, [setMessages]);

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
