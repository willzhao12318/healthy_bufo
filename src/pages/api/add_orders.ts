import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function addOrders(req: NextApiRequest, res: NextApiResponse) {
  const {method} = req;
  const {tabUid, targetTime, dishId} = req.body;
  const addressId = "1fc16f857d9e"

  if (method === "POST") {
    try {
      const formData = new FormData();
      formData.append('tabUniqueId', tabUid);
      formData.append('targetTime', targetTime);
      formData.append('order', JSON.stringify([{ count: "1", dishId: dishId }]));
      formData.append('corpAddressUniqueId', addressId);
      formData.append('userAddressUniqueId', addressId);

      const resp = await axios.post("https://meican.com/preorder/api/v2.1/orders/add", formData, {
        headers: {
          cookie: "guestId=242324c5-4fdb-47cc-8c9d-04253371f00a; cna=6044ee21934340028e8b29f97336712e; machineId=fc8df9bf-928b-4c1e-a39d-152e3d8e85eb; stv=v3; stt=bearer; oci=Xqr8w0Uk4ciodqfPwjhav5rdxTaYepD; ocs=vD11O6xI9bG3kqYRu9OyPAHkRGxLh4E; sat=hlVyzCjDZbWpxAwCpxfQ2EADx3fRkI1; srt=E1XqdC8StuSvS8LojwjdxdfG7pre8tu; sa=eyJzdHYiOiJ2MyIsInN0dCI6ImJlYXJlciIsInNhdCI6ImhsVnl6Q2pEWmJXcHhBd0NweGZRMkVBRHgzZlJrSTEiLCJzcnQiOiJFMVhxZEM4U3R1U3ZTOExvandqZHhkZkc3cHJlOHR1IiwieCI6ZmFsc2UsIm5ycCI6ZmFsc2V9; AWSALBTG=A9T6kjmooBG4BnPcArjkkHF+xgeFCxW9ukN2k8x5RvMnTA9OfasE62P/qYgj8qC4tVsN3Mzrqp1uvyN/ZXafYEYHMl5tlsDeTp7l0762l28lfknRCdxDE4UdjYm1qAO5quWRj8gvK09jILOxJJImDrklRllZgZXS703p0FKwlTAX; AWSALBTGCORS=A9T6kjmooBG4BnPcArjkkHF+xgeFCxW9ukN2k8x5RvMnTA9OfasE62P/qYgj8qC4tVsN3Mzrqp1uvyN/ZXafYEYHMl5tlsDeTp7l0762l28lfknRCdxDE4UdjYm1qAO5quWRj8gvK09jILOxJJImDrklRllZgZXS703p0FKwlTAX; AWSALB=DSqu1r99UoO7jH3+9y5PKL/U3B7ve0OApB7Dok53CfQlng+4hXNcjtE25fsGNs4ooBWaSOxJ94HDu5Gmyzzhg83bndWtKQf4W/bNd1jShHPrj02CRfQUWIm5QH3a; AWSALBCORS=DSqu1r99UoO7jH3+9y5PKL/U3B7ve0OApB7Dok53CfQlng+4hXNcjtE25fsGNs4ooBWaSOxJ94HDu5Gmyzzhg83bndWtKQf4W/bNd1jShHPrj02CRfQUWIm5QH3a",
        },
      });
      
      return res.status(200).json(resp.status);
    } catch (error) {
      console.error("Add order failure", error);
      return res.status(500).json({ message: "Add order failed" });
    }
  }
}
