import type { NextApiRequest, NextApiResponse } from "next";
import { CalendarItem, DateItem } from "./utils/models";

export default async function getDishList(req: NextApiRequest, res: NextApiResponse) {
  const dataJson = req.query;
  const currDate = dataJson?.currDate;
  if (!currDate) {
    return;
  }
  globalThis.cookieCache =
    'PLAY_FLASH="from=null&success=%E7%99%BB%E5%BD%95%E6%88%90%E5%8A%9F"; PLAY_SESSION="217b905a20efc99ed89c4eb44b51a1b7af579b90-userId=14190276"; guestId=adb9dc76-1a2e-46fd-a565-4649fd53eeac; machineId=b6dc48d8-6efd-4e1d-b547-4a8a78f26850; mcr=042d119e970303ef4ec848f572f089e8529d964c-14190276; oci=Xqr8w0Uk4ciodqfPwjhav5rdxTaYepD; ocs=vD11O6xI9bG3kqYRu9OyPAHkRGxLh4E; remember=042d119e970303ef4ec848f572f089e8529d964c-14190276; sa=eyJzdHYiOiJ2MyIsInN0dCI6ImJlYXJlciIsInNhdCI6Ijl6eEtXTFVzdWxaOEVmSkZQTVUyYlZKTHoxV0J3VWwiLCJzcnQiOiI1ZHF6VDNwcVZPQ0Y1TDlaS2d6aVVWV3NRR2VjMHg3IiwieCI6ZmFsc2V9; sat=9zxKWLUsulZ8EfJFPMU2bVJLz1WBwUl; srt=5dqzT3pqVOCF5L9ZKgziUVWsQGec0x7; stt=bearer; stv=v3';
  const { mcClient } = require("./utils/mc_persist_client");
  console.log("------------------");
  console.log(globalThis.cookieCache);
  const response = await mcClient({
    method: "get",
    url: get_calender_items_url(new Date(currDate.toString())),
    headers: {
      cookie: globalThis.cookieCache,
    },
  })
    .then((response: { [x: string]: any }) => {
      return response;
    })
    .catch((error: any) => {
      console.error(error);
      return undefined;
    });
  console.log("-----------");
  const data = response.data;
  console.log(data.dateList);
  var calendarItems: CalendarItem[] = data?.dateList
    ?.flatMap((oneDateContent: DateItem) => oneDateContent.calendarItemList)
    .filter();

  console.log("calendarItems");
  console.log(calendarItems);
  res.status(200).json({ name: response.data });
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
