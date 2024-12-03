/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR, {SWRResponse} from "swr";
import useSWRMutation, {SWRMutationResponse} from "swr/mutation";
import { AddOrderRequest, AddOrderResponse, GetTabResponse, LoginResponse } from "@/utils/type";
import axios from "axios";
import { useConfigStore } from "@/hooks/configStore";

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

export async function login(username: string, password: string): Promise<LoginResponse> {
  const loginUrl = "/api/login";
  const response = await axios.post(loginUrl, {username, password}, {timeout: 10000});
  return response.data;
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
