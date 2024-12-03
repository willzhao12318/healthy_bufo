/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWRMutation, { SWRMutationResponse } from "swr/mutation";
import {
  AddOrderRequest,
  AddOrderResponse,
  CalendarItem,
  DateItem,
  Dish,
  ListOrderedRequest,
  ListOrderedResponse,
  LoginResponse,
  Order,
  Restaurant,
  Tab,
  TabType,
} from "@/utils/type";
import axios from "axios";
import { useConfigStore } from "@/hooks/configStore";
import { mutate, SWRResponse } from "swr/_internal";

export function useAddOrder(): SWRMutationResponse<AddOrderResponse, any, AddOrderRequest> {
  const { cookie } = useConfigStore();
  const addOrder = async (_: string, { arg }: { arg: AddOrderRequest }) => {
    const addOrderUrl = "/api/order";
    const response = await axios.post(addOrderUrl, { ...arg, context: { cookies: cookie } });
    return response.data;
  };

  return useSWRMutation("noop", addOrder);
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const loginUrl = "/api/login";
  const response = await axios.post(loginUrl, { username, password }, { timeout: 10000 });
  return response.data;
}

export function useListOrder(targetDate: string): SWRResponse<ListOrderedResponse, any, any> {
  const key = `/api/get_available_tab?currDate=${targetDate}`;
  const listOrder = async (key: string, arg: ListOrderedRequest) => {
    const response = await axios.get(key);
    const orders: Order[] = response.data?.dateList?.flatmap((oneDateItem: DateItem) => {
      const date = oneDateItem.date;
      const calendarItemList = oneDateItem.calendarItemList;
      const orderList = calendarItemList.map((calendarItem: CalendarItem) => {
        const tabType =
          calendarItem?.openingTiem.name === "早餐"
            ? TabType.Breakfast
            : calendarItem?.openingTiem.name === "午餐"
            ? TabType.Lunch
            : TabType.AfternoonTea;
        const orderedDish = calendarItem.corpOrderUser?.restaurantItemList[0]?.dishItemList[0]?.dish;
        const nameLen = orderedDish.name.length;
        const leftBracket = orderedDish.name.indexOf("(");
        const restaurant: Restaurant = {
          id: "string",
          name: "string",
        };
        const aDish: Dish = {
          id: String(orderedDish.id) || "",
          chineseName: orderedDish?.name?.substring(0, leftBracket) || "",
          englishName: orderedDish?.name?.substring(leftBracket + 1, nameLen - 1) || "",
          restaurant: restaurant,
        };

        const oneTab: Tab = {
          id: String(calendarItem.targetTime),
          type: tabType,
          status: calendarItem.status,
          dishes: [],
          orderedDish: aDish,
        };

        const oneOrder: Order = {
          id: date,
          time: date,
          tab: oneTab,
        };
        return oneOrder;
      });
      return orderList;
    });
    console.log(orders);
    return orders;
  };

  return useSWR(key, listOrder);
}
