export class Post {
  id: string;
  parent?: string;
  message: string;
  date: Date;
  replies: Post[];
  user: string;
}