import { mconfig } from "@/milvus_config";
import { MilvusClient } from "@zilliz/milvus2-sdk-node/dist/milvus";
import cohere from "cohere-ai";
import type { NextApiRequest, NextApiResponse } from "next";
import milvus from "@/lib/milvus";
import { getDislikePost, getFavPost, getLikePost } from "./UserAPI";
import { postInterface } from "@/interfaces/postInterface";
// //init
// console.info("Connecting to milvus");
// const { uri, user, password, secure } = mconfig;
// var milvus = new MilvusClient(uri, true, user, password);
// console.info("Sucess");
cohere.init(process.env.COHERE_KEY);
// const COLLECTION = "posts_cohere";
// milvus.loadCollectionSync({
//   collection_name: "posts_cohere",
// });
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log((await milvus.checkHealth()).isHealthy);
  if (req.method == "POST") {
    //add vec to milvus
    const { id, title, text } = req.body;
    const co_resp = await cohere.embed({
      texts: [`${title}。${text}`],
      model: "multilingual-22-12",
      truncate: "END",
    });
    console.log(co_resp);
    const embeddings = co_resp.body.embeddings[0];
    const data = [
      {
        title: title,
        text: text,
        embedding: embeddings,
        post_id: id,
      },
    ];
    const mr = await milvus.insert({
      collection_name: "posts_cohere",
      fields_data: data,
    });
    console.log(`insertion status ${mr.status.error_code}`);
    res.status(200).json({ status: mr.status.error_code });
  } else if (req.method == "GET") {
    //show recommendation
    if(req.query.type=='recommendation'){
      //get user liked post
      const user_id = req.query.user_id as string;
      //convert to number
      const upvoted_post =  await getLikePost(parseInt(user_id)) as postInterface[];
      const downvoted_post = await getDislikePost(parseInt(user_id));
      const fav_post = await getFavPost(parseInt(user_id));
      //query top two for each
      await milvus.loadCollectionSync({
        collection_name: "posts_cohere",
      })
      let upvoted_vec, downvoted_vec, fav_vec;
      if(upvoted_post.length!=0){
        const most_recent = upvoted_post[0];
        console.log(most_recent)
        upvoted_vec = await milvus.query({
          collection_name: "posts_cohere",
          expr: `post_id in [${most_recent.id}]`,
          output_fields: ["embedding"],
        })
      }
      if(downvoted_post.length!=0){
        const most_recent = downvoted_post[0];
        downvoted_vec = await milvus.query({
          collection_name: "posts_cohere",
          expr: `post_id in [${most_recent.id}]`,
          output_fields: ["embedding"],
        })
      }
      if(fav_post.length!=0){

      }
      const search_params = {
        anns_field: "embedding",
        topk: "11",
        metric_type: "L2",
        params: JSON.stringify({ nprobe: 10 }),
      };
      const toUse = [upvoted_vec?.data].filter((vec)=>vec!==undefined);
      console.log(toUse.length);
      if(toUse[0]?.length===0){
        res.status(200).json([]);
        return;
      }else{
        const vectors = toUse.map((vec)=>vec.data[0].embedding);
        const results = await milvus.search({
          collection_name: "posts_cohere",
          search_params: search_params,
          vector_type: 101,
          vectors: vectors,
          output_fields: ["post_id", "title"],
        });
        console.log(results.results);
        res.status(200).json(results.results.slice(1));
      }

    }
    //show related post
    //search vector
    const id = req.query.post_id;
    console.log(id);
    await milvus.loadCollectionSync({
      collection_name: "posts_cohere",
    });
    console.log("collection loaded");
    const queried_vec = await milvus.query({
      collection_name: "posts_cohere",
      expr: `post_id in [${id}]`,
      output_fields: ["embedding"],
    });
    console.log("query status ");
    console.log(queried_vec.data[0].embedding);

    const search_params = {
      anns_field: "embedding",
      topk: "11",
      metric_type: "L2",
      params: JSON.stringify({ nprobe: 10 }),
    };

    await milvus.loadCollectionSync({
      collection_name: "posts_cohere",
    });

    const results = await milvus.search({
      collection_name: "posts_cohere",
      search_params: search_params,
      vector_type: 101,
      vectors: [queried_vec.data[0].embedding],
      output_fields: ["post_id", "title"],
    });
    console.log(results);
    console.log(typeof results.results);
    res.status(200).json(results.results.slice(1));
  }else if (req.method=='DELETE'){
    const id = req.query.post_id;
    const mr = await milvus.deleteEntities({
      collection_name: "posts_cohere",
      expr: `post_id in [${id}]}`,
    });
    console.log(`deletion status ${mr.status.error_code}`);
    res.status(200).json({ status: mr.status.error_code });
  }
  // await milvus.releaseCollection({ collection_name: "posts_cohere" });
}
