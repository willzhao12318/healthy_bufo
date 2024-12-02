import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { startTransition } from 'react';

export const CONFIG_STORE_NAME = "meican_config";

export type configStoreProps = {
  username: string;
  password: string;
  // if cookie was expired, need to re-login to get a new cookie and set it here again on client side
  cookie?: string;
  locale: string;
  theme: string;
}

export type ConfigStoreActions = {
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  setCookie: (cookie: string) => void;
  setLocale: (locale: string) => void;
  setTheme: (theme: string) => void;
  getConfig: () => configStoreProps;
  reset: () => void;
}

export type ConfigStoreProps = configStoreProps & ConfigStoreActions;

const initialState: configStoreProps = {
  username: "",
  password: "",
  locale: "zh-CN",
  theme: "light",
}

export const useConfigStore = create<ConfigStoreProps>()(
  persist(
    devtools(
      (set, get) => ({
        ...initialState,
        setUsername: (username) => set({ username }),
        setPassword: (password) => set({ password }),
        setCookie: (cookie) => set({ cookie }),
        setLocale: (locale) => set({ locale }),
        setTheme: (theme) => {
          startTransition(() => {
            set({ theme });
          });
        },
        reset: () => set(initialState),
        getConfig: () => get(),
      }),
      {
        name: CONFIG_STORE_NAME,
        store: "ConfigStore",
        enabled: process.env.NODE_ENV !== "production",
      }
    ),
    {
      name: CONFIG_STORE_NAME,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
