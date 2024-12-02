import SettingForm from "@/components/Setting";
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
      return <div>Chat</div>;
    case AppCurrentPage.Orders:
      return <div>Orders</div>;
    case AppCurrentPage.Setting:
      return <SettingForm initialValues={configStore} />;
  }
};

export default Home;
