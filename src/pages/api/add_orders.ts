import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { useConfigStore } from "@/hooks/configStore";

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
          cookie: "guestId=242324c5-4fdb-47cc-8c9d-04253371f00a; cna=6044ee21934340028e8b29f97336712e; machineId=fc8df9bf-928b-4c1e-a39d-152e3d8e85eb; stv=v3; stt=bearer; oci=Xqr8w0Uk4ciodqfPwjhav5rdxTaYepD; ocs=vD11O6xI9bG3kqYRu9OyPAHkRGxLh4E; sat=G6thbgLXrFX2UdpkZ9978XmEok2NNEC; srt=m7YB97CpEIv3B5TrCKJ9F3wvnvN4zGP; sa=eyJzdHYiOiJ2MyIsInN0dCI6ImJlYXJlciIsInNhdCI6Ikc2dGhiZ0xYckZYMlVkcGtaOTk3OFhtRW9rMk5ORUMiLCJzcnQiOiJtN1lCOTdDcEVJdjNCNVRyQ0tKOUYzd3Zudk40ekdQIiwieCI6ZmFsc2UsIm5ycCI6ZmFsc2V9; AWSALBTG=IDbr/h4RGadl/ggtGmKbgX2GlNuOGKs0ct4T+TitNyKMQe/XDBDZWuTRuaI5ZmMvprxY++vCEhaHrg/VCZOfnO0iyPnJ+AIHjhKBQEEk2Ymm5b6w9d32WdVvKdgR047JzZ4RHnH005crQFLTzsywq6d4kyX7pmAuraGEHUe78J8u; AWSALBTGCORS=IDbr/h4RGadl/ggtGmKbgX2GlNuOGKs0ct4T+TitNyKMQe/XDBDZWuTRuaI5ZmMvprxY++vCEhaHrg/VCZOfnO0iyPnJ+AIHjhKBQEEk2Ymm5b6w9d32WdVvKdgR047JzZ4RHnH005crQFLTzsywq6d4kyX7pmAuraGEHUe78J8u; AWSALB=/Tu6Z/ADD9TCrpkZvF3tSvJknDnj/pU1aIP/7MK46/gxFvhGA7vQZoXn+j9Z9vlnkYLtOM7JE9oJcgXt/YW7fL45LyLaC1b8yCZ6qgP5rWrjSJlfX9lMhBFXvduh; AWSALBCORS=/Tu6Z/ADD9TCrpkZvF3tSvJknDnj/pU1aIP/7MK46/gxFvhGA7vQZoXn+j9Z9vlnkYLtOM7JE9oJcgXt/YW7fL45LyLaC1b8yCZ6qgP5rWrjSJlfX9lMhBFXvduh",
        },
      });

      console.log(resp.data)
      
      return res.status(200).json(resp.data);
    } catch (error) {
      console.error("Add order failure", error);
      return res.status(500).json({ message: "Add order failed" });
    }
  }
}
