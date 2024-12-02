import { create } from "zustand";
import { devtools } from "zustand/middleware";

export enum AppCurrentPage {
  Setting = "setting",
  Chat = "chat",
  Orders = "calendar",
}

export type appStoreProps = {
  currentPage: AppCurrentPage;
}

export type AppStoreActions = {
  setCurrentPage: (currentPage: AppCurrentPage) => void;
}

export type AppStoreProps = appStoreProps & AppStoreActions;

const initialState: appStoreProps = {
  currentPage: AppCurrentPage.Chat,
}

export const useAppStore = create<AppStoreProps>()(
  devtools(
    (set) => ({
      ...initialState,
      setCurrentPage: (currentPage) => set({ currentPage }),
    }),
    {
      name: "app",
      store: "AppStore",
      enabled: process.env.NODE_ENV !== "production",
    }
  )
)
