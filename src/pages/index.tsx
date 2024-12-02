import OrderTable from "@/components/OrderTable";
import SettingForm from "@/components/Setting";
import ChatBot from "@/components/Chatbot";
import { AppCurrentPage } from "@/hooks/appStore";
import { useAppStore } from "@/hooks/appStore";
import { useConfigStore } from "@/hooks/configStore";
import React from "react";

const Home = () => {
  const { currentPage } = useAppStore();
  const { getConfig } = useConfigStore();
  const configStore = getConfig();

  switch (currentPage) {
    case AppCurrentPage.Chat:
      return <ChatBot />;
    case AppCurrentPage.Orders:
      return <OrderTable />;
    case AppCurrentPage.Setting:
      return <SettingForm initialValues={configStore} />;
  }
};

export default Home;
