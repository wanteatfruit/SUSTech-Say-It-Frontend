import type { NextApiRequest, NextApiResponse } from "next";
import milvus from "@/lib/milvus";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    await milvus.loadCollectionSync({
        collection_name: "posts_cohere",
      });
    await milvus.deleteEntities({
        collection_name: "posts_cohere",
        expr: "id in [441641457057531082]"
    }).then((res) => {
        console.log(res.IDs)
        console.log(res);
    }).catch((err) => {
        console.log(err);
    })
    const data = await milvus.query({
        collection_name: "posts_cohere",
        expr: "id>=0",
        output_fields: ["post_id", "text"],
    })

    res.status(200).json({ message: "success", data: data.data });
  }  