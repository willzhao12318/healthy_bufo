import bufo from "@/assets/bufo.gif";
import {Bubble, Prompts, Sender, useXAgent, useXChat, Welcome} from "@ant-design/x";
import React, {useEffect, useMemo} from "react";
import Image from "next/image";

import {FireOutlined, GiftOutlined, UserOutlined} from "@ant-design/icons";
import {type GetProp, Layout, Space, Spin, theme} from "antd";
import { useTranslation } from "react-i18next";
import {Content} from "antd/es/layout/layout";
import {MessageInfo} from "@ant-design/x/es/useXChat";
import analyze from "../client/endpoints/request_analyze";
import {RoleType} from "@ant-design/x/es/bubble/BubbleList";
import categorize from "@/client/endpoints/request_categorization";
import {AddOrderRequest, Category, RecommendResult, TabInfoForOrder, WeekDay} from "@/utils/type";
import {recommend} from "@/pages/api/recommend";
import {humanAIMealPlan} from "@/utils/mockData";
import i18n, {t} from "i18next";
import {useAddOrder, useGetOrder, useGetTab} from "../client/controller";
import {convertTimestampToDate, getTabType} from "@/utils/utils";

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

  const { trigger: getOrder } = useGetOrder();
  const {trigger: placeOrder} = useAddOrder();
  const { data: tabData} = useGetTab();
  // //hard code for now
  const tabInfoForOrder:TabInfoForOrder[] = useMemo(() =>{
    if (!tabData){
      return []
    }
    const orderTabData:TabInfoForOrder[]  = [];
    tabData.dateList?.forEach(
      day => {
      if (day.date >= '2024-12-04' && day.date <= '2024-12-06') {
        let weekDay = WeekDay.Wednesday;
        if (day.date === '2024-12-05'){
          weekDay = WeekDay.Thursday;
        }
        if (day.date === '2024-12-06'){
          weekDay = WeekDay.Friday;
        }
        day.calendarItemList.forEach(item => {
          if (item.status === 'AVAILABLE') { // Assuming 'ORDER' means available
            const tabType = getTabType(item.title);
            orderTabData.push({
              tabId: item.userTab.uniqueId,
              tabType,
              targetTime: item.targetTime,
              weekDay: weekDay,
            });
          }
        });
      }
    });
    return orderTabData;
  },[tabData]);

  // ==================== Runtime ====================
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess }) => {
      if (!message){
        onSuccess("Please tell me what you need");
        return;
      }
      if (message === t("analyzeDishes")) {
        const requestOrder = await getOrder("");
        message = JSON.stringify(requestOrder);
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
          case Category.CategoryRequestOrder:
            setMessages(prevMessages => prevMessages.slice(0, -1));
            const recommendHistory = localStorage.getItem("bufo-recommended-dish")
            if (!recommendHistory) {
              onSuccess(t("noRecommendation"))
              break;
            }
            const recommendedDish: RecommendResult = JSON.parse(recommendHistory);
            if(recommendedDish.breakfast.length === 0 && recommendedDish.lunch.length === 0 && recommendedDish.afternoonTea.length === 0) {
              onSuccess(t("noRecommendation"))
              break;
            }
            if (tabInfoForOrder.length === 0){
              onSuccess(t("alreadyOrdered"))
              break;
            }
            asyncPlaceOrder(tabInfoForOrder,recommendedDish);
            onSuccess(t("dishOrdered"));
            break;
          case Category.CategoryMaliciousInput:
            setMessages(prevMessages => prevMessages.slice(0, -1));
            onSuccess(result.text || t("invalidCategory"));
            break;
          case Category.CategoryUnrelated:
            setMessages(prevMessages => prevMessages.slice(0, -1));
            onSuccess(result.text || t("invalidCategory"));
            break;
          case Category.CategoryRequestMenuRecommendation:
            const recommendResult = await recommend({userInput:message,mealPlan:humanAIMealPlan});
            if (!recommendResult) {
              setMessages(prevMessages => prevMessages.slice(0, -1));
              onSuccess(t("noRecommendResult"));
              break;
            }
            localStorage.setItem("bufo-recommended-dish",JSON.stringify(recommendResult));
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
            const response = await analyze(message, i18n.language);
            const analyzeResult = response.analyzeResult;
            if (analyzeResult.length === 0) {
              setMessages(prevMessages => prevMessages.slice(0, -1));
              onSuccess(t("noAnalysisResult"));
            }
            const htmlString = analyzeResult.map(item => `
            <div>
            <b>☀️${item.date}</b><br/>
            <b>${item.name}</b><br/>
            <p>${t("protein")}: ${item.protein}g</p>
            <p>${t("fat")}: ${item.fat}g</p>
            <p>${t("carbohydrate")}: ${item.carbohydrate}g</p>
            <p>${t("healthScore")}: ${item.healthIndex}</p>
            <p>${t("healthTips")}: ${item.healthAnalysis}</p>
            <p>${t("calories")}: ${item.calories}</p>
            <p>${t("bufoSlogan")}: ${item.bufoSlogan}</p>
            </div>`).join("");
          setMessages(prevMessages => prevMessages.slice(0, -1));
          onSuccess(htmlString);
        }
      } catch (e){
        console.error(e);
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

  const asyncPlaceOrder = async (tabInfoForOrder:TabInfoForOrder[],recommendResult:RecommendResult)=>{
    for (const item of tabInfoForOrder) {
      let candidateList = recommendResult.breakfast
      if (item.tabType === "lunch"){
        candidateList = recommendResult.lunch;
      }
      if (item.tabType === "afternoonTea"){
        candidateList = recommendResult.afternoonTea;
      }
      const recommendedDish = candidateList.find(dish => dish.weekDay === item.weekDay);
      if (!recommendedDish) {
        console.error("no recommended dish found for week", item.weekDay,"tabType:",item.weekDay);
      }else{
        const req:AddOrderRequest = {dishId: recommendedDish.dishId, tabUid: item.tabId, targetTime: convertTimestampToDate(item.targetTime)};
        placeOrder(req);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }




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
              {
                key:"order_dishes",
                description: t("orderDishes")
              }
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
            {
              key: "request_order",
              description: t("orderDishes"),
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
