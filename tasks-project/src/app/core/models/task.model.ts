export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'backlog' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  project_id: number;
  assigned_to?: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: 'backlog' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  projectId: number;
  assignedTo?: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: 'backlog' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  assignedTo?: number;
}
