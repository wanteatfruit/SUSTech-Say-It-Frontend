import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(config);
const summarize_prompt =
  "将以下文章概括为 100 个字，使其易于阅读和理解。标题：\n\n";
const toxicity_prompt = "请告诉我以下文字是否有令人反感的内容或暴力内容或脏话。只回答“是”或“否”\n\n### 文字：\n\n";
// const toxicity_prompt =
//   "I want you to tell me whether the following Chinese text contains sensitive content or violent content or dirty words. Respond with only 'yes' or 'no' \n\n### Text:\n\n";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const type = req.query.type;

  const post_id = req.query.post_id === undefined ? "" : req.query.post_id;
  let raw_text= "";
  console.log(post_id);
  if (post_id !== undefined && post_id.length > 0 && post_id!=='-1') {
    await milvus.loadCollectionSync({ collection_name: "posts_cohere" });
    const queried = await milvus.query({
      collection_name: "posts_cohere",
      expr: `post_id in [${post_id}]`,
      output_fields: ["post_id", "text"],
    });
    raw_text = queried.data[0].text.substring(0, 500);
  }

  if (type == "toxicity") {
    // console.log(raw_text);
    const title = req.query.title as string;
    if(raw_text.length == 0){
      raw_text =req.query.text as string;
    }
    console.log(raw_text)
    const proxy = process.env.NODE_ENV == "production" ? {} : {
      host: "127.0.0.1",
      port: 7890,
    }
    const tox_response = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        // messages: [{ role: "user", content: `How is UCLA as a` }],
        messages: [{ role: "user", content: `${toxicity_prompt} ${title}。${raw_text}` }],
      },
    );
    console.log(tox_response.data.choices[0].message?.content);
    res
      .status(200)
      .json({ toxicity: tox_response.data.choices[0].message?.content });
  } else if (type == "summarize") {
    const title = req.query.title as string;

    console.log(`${summarize_prompt}${title}正文:${raw_text}`);
    try {
      const sum_response = await openai.createChatCompletion(
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "user", content: `${summarize_prompt}${title}正文:${raw_text}` },
          ],
        },
        {
          timeout: 100000,
          proxy: {
            host: "127.0.0.1",
            port: 7890,
          },
        }
      );
      console.log(sum_response.data.choices[0].message?.content);
      res
        .status(200)
        .json({ summary: sum_response.data.choices[0].message?.content });
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  }
}
