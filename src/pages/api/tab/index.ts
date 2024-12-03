import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  if (method === "POST") {
    const {context} = req.body;
    const today = new Date();
    const url = get_calender_items_url(today);
    const resp = await axios.get(url, {
      headers: {
        cookie: context.cookies,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    });
    return res.status(200).json(resp.data);
  }
}

const get_calender_items_url = (today: Date) => {
  const first = today.getDate() - today.getDay();
  const end = first + 6;
  const firstDate = new Date(today.setDate(first));
  const endDate = new Date(today.setDate(end));
  const params = new URLSearchParams({
    beginDate: firstDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
    withOrderDetail: "false",
  });
  return `https://meican.com/preorder/api/v2.1/calendarItems/list?${params.toString()}`;
};
