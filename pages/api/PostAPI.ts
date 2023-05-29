import { postInterface } from "@/interfaces/postInterface";
import { getCookie } from "../_app";
import { commentInterface } from "@/interfaces/commentInterface";
import axios from "axios";

let option = null;
const token = getCookie();
if (token !== undefined) {
  option = {
    headers: {
      token: `${token}`,
    },
  };
}
const host = "http://120.25.216.186:8888";
export const axios_instance = axios.create({
  headers: {
    token: token,
  },
});

export async function sortByViewCount(): Promise<postInterface[]> {
  const res = await fetch(host + "/post/sortbyviewcount");
  const data = await res.json();
  return data;
}

export async function sortByVoteScore(): Promise<postInterface[]> {
  const res = await fetch(host + "/post/sortbyvotescore");
  const data = await res.json();
  return data;
}

export async function sortByDate(): Promise<postInterface[]> {
  const res = await fetch(host + "/post/sortbydate");
  const data = await res.json();
  return data;
}

export function addViewCount(title: string) {
  axios
    .post(host + `/post/addviewcount?title=${title}`)
    .then((resp) => {})
    .catch((e) => {
      console.log(e);
    });
}

export const addUpVote = (title: string) => {
  var data;
  console.log(getCookie());
  axios_instance
    .post(host + `/post/addupvote?title=${title}`)
    .then((resp) => {
      console.log(resp.data);
      data = resp.data;
      return data;
    })
    .catch((e) => {
      console.log(e);
    });
  return data;
};

export const addDownVote = (title: string) => {
  var data;
  axios_instance
    .post(host + `/post/adddownvote?title=${title}`)
    .then((resp) => {
      console.log(resp.data);
      data = resp.data;
      return data;
    })
    .catch((e) => {
      console.log(e);
    });
  return data;
};
// export function cors(addUpVote);

export async function getPostsBySpace(spaceID: number) {
  const res = await fetch(
    host + `/post/getallpostbyspaceid?spaceid=${spaceID.toString()}`
  );
  const data = await res.json();
  console.log(host + `/post/getallpostbyspaceid?spaceid=${spaceID.toString()}`);
  return data;
}

export async function getPostByID(postID: string) {
  const res = await fetch(host + `/post/getpostbyid?postid=${postID}`);
  // console.log(host+`/post/getpostbyid?postid=${postID.toString()}`)
  const data = await res.json();
  return data;
}

export async function getVote(title: string) {
  const res = await fetch(host + `/post/getvotescore?title=${title}`);
  // console.log(host+`/post/getvotescore?title=${title.toString()}`)
  const data = await res.json();
  return data;
}

export async function getCommentsBypostID(
  postID: string
): Promise<commentInterface[]> {
  const res = await fetch(
    host + `/comment/getallcommentbypostid?postid=${postID}`
  );
  const data = await res.json();
  return data;
}

export async function getPostStatus(post_id: string) {
  try {
    console.log(token);
    if (token === null) {
      return {
        upvote: false,
        downvote: false,
        fav: false,
      };
    }
    const res = await axios_instance.get(
      host + `/post/getPostStatus?post_id=${post_id}`
    );
    const data = await res.data;
    console.log(
      "postStatusData: " + data.upvote + " " + data.downvote + " " + data.fav
    );
    return data;
  } catch (e) {
    console.log(e);
  }
}

export async function deleteUpvote(title: string) {
  const res = await axios_instance.post(
    host + `/post/deleteupvote?title=${title}`
  );
  const data = await res.data;
  return data;
}

export async function deleteDownvote(title: string) {
  const res = await axios_instance.post(
    host + `/post/deletedownvote?title=${title}`
  );
  const data = await res.data;
  return data;
}
