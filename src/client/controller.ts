/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWRMutation, {SWRMutationResponse} from "swr/mutation";
import { AddOrderRequest, AddOrderResponse, LoginResponse } from "@/utils/type";
import axios from "axios";

export function useAddOrder(): SWRMutationResponse<
  AddOrderResponse,
  any,
  AddOrderRequest
> {
  const addOrder = async (
    _: string,
    {arg}: {arg: AddOrderRequest}
  ) => {
    const addOrderUrl = "/api/add_orders";
    const response = await axios.post(addOrderUrl, arg);
    return response.data;
  };

  return useSWRMutation("noop", addOrder);
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const loginUrl = "/api/login";
  const response = await axios.post(loginUrl, {username, password}, {timeout: 10000});
  return response.data;
}
