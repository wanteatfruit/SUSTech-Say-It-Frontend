// export async function getStaticPaths(){ //暂时没用这里做static generation，需要map全部post的id（get all post)
//     const res = get
// }

export type relatedPost = {
  id: string;
  post_id: number;
  score: number;
  title: string;
};
