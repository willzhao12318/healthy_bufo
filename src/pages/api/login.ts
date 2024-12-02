import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { preDefinedHeaders } from "./utils/type";

export default function login(req: NextApiRequest, res: NextApiResponse) {
  console.log("--------");
  const dataJson = req.query;
  const userName = dataJson?.userName;
  const password = dataJson?.password;
  if (!userName || !password) {
    return;
  }
  const { mcClient } = require("./utils/mc_persist_client");
  console.log(userName);
  return axios
    .post("https://meican.com/account/directlogin", {
      params: {
        username: userName,
        password: password,
        loginType: "username",
        remember: "true",
        redirectUrl: "",
      },
      headers: preDefinedHeaders,
    })
    .then((response: { [x: string]: any; data: any }) => {
      console.log(response.headers["set-cookie"]);
      globalThis.cookieCache = response.headers["set-cookie"];
      console.log(globalThis.cookieCache);
      //   console.log(response);
      mcClient.defaults.headers.cookie = response.headers["set-cookie"];
      return response.data;
    })
    .catch((error: any) => {
      console.error(error);
      return undefined;
    });
}
