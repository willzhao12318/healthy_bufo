/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWRMutation, {SWRMutationResponse} from "swr/mutation";
import { AddOrderRequest, AddOrderResponse } from "@/utils/type";
import axios from "axios";
import {mutate} from "swr";

export function useAddOrder(): SWRMutationResponse<
  AddOrderResponse,
  any,
  any, 
  any
> {
  const addOrder = async (
    _key: string,
    {arg}: {arg: AddOrderRequest}
  ) => {
    const addOrderUrl = `/api/add_orders`;
    const response = await axios.post(addOrderUrl, arg);
    mutate(key => typeof key === "string" && key.startsWith(addOrderUrl));
    return response.data;
  };

  return useSWRMutation("noop", addOrder);
}

