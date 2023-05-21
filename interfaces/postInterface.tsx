export interface postInterface {
  id: number;
  userid: number;
  spaceid: number;
  title: string;
  content: string;
  time: string;
  upvote: number;
  downvote: number;
  pinned: boolean;
  viewcount: number;
  userName?:string
}
