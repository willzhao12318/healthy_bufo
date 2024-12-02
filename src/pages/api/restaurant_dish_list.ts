import type { NextApiRequest, NextApiResponse } from "next";

export default async function restaurantDishList(req: NextApiRequest, res: NextApiResponse) {
  const dataJson = req.query;
  const restaurantList = dataJson?.restaurantList;
  if (!restaurantList) {
    return;
  }
}
