/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR, {SWRResponse} from "swr";
import useSWRMutation, {SWRMutationResponse} from "swr/mutation";
import { AddOrderRequest, AddOrderResponse, GetTabResponse, LoginResponse, Order, TabType } from "@/utils/type";
import axios from "axios";
import { useConfigStore } from "@/hooks/configStore";
import { CalendarResponse } from "@/utils/tab_meican_type";

export function useAddOrder(): SWRMutationResponse<
  AddOrderResponse,
  any,
  AddOrderRequest
> {
  const { cookie } = useConfigStore();
  const addOrder = async (
    _: string,
    {arg}: {arg: AddOrderRequest}
  ) => {
    const addOrderUrl = "/api/order";
    const response = await axios.post(addOrderUrl, {...arg, context: {cookies: cookie}});
    return response.data;
  };

  return useSWRMutation("noop", addOrder);
}

export function useGetOrder(): SWRMutationResponse<any, any, any> {
  const { cookie } = useConfigStore();
  const getOrder = async() => {
    const getOrderUrl = "/api/tab";
    const response = await axios.post(getOrderUrl, { context: {cookies: cookie}});
    const data = response.data;
    const responseData = data.dateList.map((dateData: any) => {
      const dateString = dateData.date;
      return dateData.calendarItemList.map((item: any) => {
        if (item.corpOrderUser !== undefined && item.corpOrderUser !== null) {
          const dishName = item.corpOrderUser.restaurantItemList[0].dishItemList[0].dish.name;

          const dishType = item.title.includes("早餐") ? "breakfast" : item.title.includes("午餐") ? "lunch" : "afternoonTea";
          // console.log(dishType)
          const itemString = {
            "date": dateString,
            [dishType]: dishName
          }
          return itemString
        }
      }).filter((item: any) => item !== undefined);
    }).filter((item: any) => item !== undefined && item.length > 0);

    return responseData;
  }

  return useSWRMutation("noop", getOrder);
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const loginUrl = "/api/login";
  const response = await axios.post(loginUrl, {username, password}, {timeout: 10000});
  return response.data;
}

export function useGetOrders(): SWRResponse<
  Order[],
  any,
  any
> {
  const { cookie } = useConfigStore();
  const getTabUrl = "/api/tab";

  const fetcher = async () => {
    const result = await axios.post(getTabUrl, {context: {cookies: cookie}});
    const data: CalendarResponse = result.data;
    const res: Order[] = []
    data.dateList.forEach((dateItem) => {
      const date = dateItem.date;
      for (const tab of dateItem.calendarItemList) {
        if (tab.corpOrderUser === undefined || tab.corpOrderUser === null) {
          continue;
        }
        const dish = tab.corpOrderUser?.restaurantItemList[0].dishItemList[0].dish;
        const {chineseName, englishName} = splitDishName(dish?.name ?? "");
        res.push({
          time: date,
          tab: {
            type: tab.title.includes("早餐") ? TabType.Breakfast : tab.title.includes("下午茶") ? TabType.AfternoonTea : TabType.Lunch,
            orderedDish: {
              id: dish?.id?.toString(),
              chineseName: chineseName,
              englishName: englishName,
              restaurant: {
                id: tab.corpOrderUser?.restaurantItemList[0].uniqueId ?? "",
                name: "",
              },
            },
            status: tab.status,
            id: tab.targetTime.toString(),
          },
        });
      }
    });
    return res;
  };
  return useSWR(getTabUrl, fetcher, {});
}

export function useGetTab(): SWRResponse<
  GetTabResponse,
  any,
  any
> {
  const { cookie } = useConfigStore();
  const getTabUrl = "/api/tab";

  const fetcher = async () => {
    const result = await axios.post(getTabUrl, {context: {cookies: cookie}});
    return result.data;
  };
  return useSWR(getTabUrl, fetcher, {});
}

export function splitDishName(fullName: string): { chineseName: string; englishName: string } {
  const match = fullName.match(/(.+?)\((.+?)\)/);
  if (match) {
    return {
      chineseName: match[1].trim(),
      englishName: match[2].trim()
    };
  }
  return {
    chineseName: fullName.trim(),
    englishName: ''
  };
}
