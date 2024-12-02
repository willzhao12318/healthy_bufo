import type { NextApiRequest, NextApiResponse } from "next";

export default async function restaurantDishList(req: NextApiRequest, res: NextApiResponse) {
  const dataJson = req.query;
  const currDate = dataJson?.currDate;
  if (!currDate) {
    return;
  }
  const { mcClient } = require("./utils/mc_persist_client");
  console.log("------------------");
  console.log(globalThis.cookieCache);
  const response = await mcClient({
    method: "get",
    url: get_calender_items_url(new Date(currDate.toString())),
    headers: {
      cookie:
        'PLAY_SESSION="217b905a20efc99ed89c4eb44b51a1b7af579b90-userId=14190276"; guestId=adb9dc76-1a2e-46fd-a565-4649fd53eeac; machineId=b6dc48d8-6efd-4e1d-b547-4a8a78f26850; mcr=042d119e970303ef4ec848f572f089e8529d964c-14190276; oci=Xqr8w0Uk4ciodqfPwjhav5rdxTaYepD; ocs=vD11O6xI9bG3kqYRu9OyPAHkRGxLh4E; remember=042d119e970303ef4ec848f572f089e8529d964c-14190276; sa=eyJzdHYiOiJ2MyIsInN0dCI6ImJlYXJlciIsInNhdCI6IkVudHhnU01KbGtoT2w5SzBHZXR3Y0RoVDVoMnNXbkoiLCJzcnQiOiJ3dERodmpOenVkUmhoaExNT1hFQ1V6dGVpMGJueExGIiwieCI6ZmFsc2V9; sat=EntxgSMJlkhOl9K0GetwcDhT5h2sWnJ; srt=wtDhvjNzudRhhhLMOXECUztei0bnxLF; stt=bearer; stv=v3',
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
  console.log(response._calendar_items);
  console.log("-----------");
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
