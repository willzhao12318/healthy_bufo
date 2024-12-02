import type { NextApiRequest, NextApiResponse } from "next";
import { preDefinedHeaders } from "./utils/const_type";
import { mergeCookies } from "./utils/cookie_utils";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  console.log("--------");
  const dataJson = req.query;
  const userName = dataJson?.userName || "";
  const password = dataJson?.password || "";
  if (!userName || !password) {
    return;
  }
  const { mcClient } = require("./utils/mc_persist_client");
  console.log(userName);
  const bodyFormData = new FormData();
  bodyFormData.append("username", userName as string);
  bodyFormData.append("password", password as string);
  bodyFormData.append("loginType", "username");
  bodyFormData.append("remember", "true");
  console.log(bodyFormData);
  const response = await mcClient({
    method: "post",
    url: "https://meican.com/account/directlogin",
    data: bodyFormData,
    headers: { ...preDefinedHeaders },
  })
    .then((response: { [x: string]: any }) => {
      console.log(response.headers["set-cookie"]);
      //   console.log(response.config);
      globalThis.cookieCache = mergeCookies(response.headers["set-cookie"]);
      //   console.log(globalThis.cookieCache);
      //   mcClient.defaults.headers.cookie = response.headers["set-cookie"];
      return response;
    })
    .catch((error: any) => {
      console.error(error);
      return undefined;
    });
  res.status(200).json({ name: "Done", cookie: mergeCookies(response.headers["set-cookie"]) });
}
