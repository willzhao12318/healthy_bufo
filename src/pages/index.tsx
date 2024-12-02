import OrderTable from "@/components/OrderTable";
import SettingForm from "@/components/Setting";
import ChatBot from "@/components/Chatbot";
import { AppCurrentPage } from "@/hooks/appStore";
import { useAppStore } from "@/hooks/appStore";
import { useConfigStore } from "@/hooks/configStore";
import React from "react";
import Head from "next/head";

const HomeContainer = () => {
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
}

const Home = () => {
  return (
    <>
      <Head>
        <title>Healthy Bufo</title>
        <meta name="description" content="Healthy Bufo helps you to eat healthier" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomeContainer />
    </>
  )
};

export default Home;
