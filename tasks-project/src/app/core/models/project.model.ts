export interface Project {
  id: number;
  name: string;
  description?: string;
  team_id: number;  // Changed from teamId to match server
  status: 'active' | 'completed' | 'archived';
  created_at: Date;
  updated_at: Date;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  teamId: number;  // Keep as teamId for sending to server
}
