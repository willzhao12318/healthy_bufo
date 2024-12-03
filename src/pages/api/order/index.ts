import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {method} = req;
  if (method === "POST") {
    const {tabUid, targetTime, dishId, context} = req.body;
    const addressId = "1fc16f857d9e"
    try {
      const formData = new FormData();
      formData.append('tabUniqueId', tabUid);
      formData.append('targetTime', targetTime);
      formData.append('order', JSON.stringify([{ count: "1", dishId: dishId }]));
      formData.append('corpAddressUniqueId', addressId);
      formData.append('userAddressUniqueId', addressId);

      const resp = await axios.post("https://meican.com/preorder/api/v2.1/orders/add", formData, {
        headers: {
          cookie: context.cookie
        },
      });
      
      return res.status(200).json(resp.status);
    } catch (error) {
      console.error("Add order failure", error);
      return res.status(500).json({ message: "Add order failed" });
    }
  }
}
