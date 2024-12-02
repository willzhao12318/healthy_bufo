import { AppCurrentPage } from "@/hooks/appStore";
import { useAppStore } from "@/hooks/appStore";
import React from "react";

const Home = () => {
  const { currentPage } = useAppStore();

  switch (currentPage) {
    case AppCurrentPage.Chat:
      return <div>Chat</div>;
    case AppCurrentPage.Orders:
      return <div>Orders</div>;
    case AppCurrentPage.Setting:
      return <div>Setting</div>;
  }
};

export default Home;
