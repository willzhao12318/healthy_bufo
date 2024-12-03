import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  console.log("--------");
  const dataJson = req.query;
  const userName = dataJson?.userName;
  const password = dataJson?.password;
  if (!userName || !password) {
    return;
  }
  //const { mcClient } = require("./utils/mc_persist_client");
  console.log(userName);

  function createAxios() {
    return axios.create({withCredentials: true});
  }
  const axiosInstance = createAxios();

  const cookieJar = {
    myCookies: undefined,
  };

  const formData = new FormData();
    formData.append('username', 'wzhao2@flexport.com');
    formData.append('password', 'a%yEU3@G9Vqo#8');
    formData.append('loginType', 'username');
    formData.append('remember', 'true');

  const response = await axiosInstance.post("https://meican.com/account/directlogin", formData, {
  });

  // Extract the cookie from the response headers
  const cookie = response.headers["set-cookie"]?.join("; ");
  console.log(response.status);
  console.log(response.headers);
  //mcClient.defaults.headers.cookie = cookie;

  return res.status(200).json(response.data);

}