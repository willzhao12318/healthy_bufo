import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {method} = req;
  if (method === "GET") {
    // TODO get dishes
    res.status(200).json({message: "get dishes"});
  } else if (method === "POST") {
    // TODO add dish
    res.status(200).json({message: "add dish"});
  }
}
