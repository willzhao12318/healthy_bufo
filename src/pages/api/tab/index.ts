import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {method} = req;
  if (method === "GET") {
    // TODO get tabs
    res.status(200).json({message: "get tabs"});
  } else if (method === "POST") {
    // TODO add tab
    res.status(200).json({message: "add tab"});
  }
}
