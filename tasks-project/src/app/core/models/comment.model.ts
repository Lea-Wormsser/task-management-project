export interface Comment {
  id: number;
  body: string;
  task_id: number;
  user_id: number;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateCommentDto {
  body: string;
  taskId: number;
}
