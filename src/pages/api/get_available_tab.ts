import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import preDefinedHeaders from "util/types";
import { axiosInstance } from "./utils/type";
import { headers } from "next/headers";

export default async function restaurantDishList(req: NextApiRequest, res: NextApiResponse) {
  const dataJson = req.query;
  const currDate = dataJson?.currDate;
  if (!currDate) {
    return;
  }
  const { mcClient } = require("./utils/mc_persist_client");
  return mcClient
    .get(get_calender_items_url(new Date(currDate.toString())), {
      headers: {
        cookies: globalThis.cookieCache[0],
      },
    })
    .then((response: { [x: string]: any }) => {
      console.log(response);
      console.log(response);
      return response.data;
    })
    .catch((error: any) => {
      console.error(error);
      return undefined;
    });
}

const get_calender_items_url = (today: Date) => {
  const first = today.getDate() - today.getDay();
  const end = first + 6;
  const firstDate = new Date(today.setDate(first));
  const endDate = new Date(today.setDate(end));
  const dateJson = {
    beginDate: firstDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
    withOrderDetail: false,
  };
  return `https://meican.com/preorder/api/v2.1/calendarItems/list?beginDate=${dateJson.beginDate}&endDate=${dateJson.endDate}&withOrderDetail=false`;
};
