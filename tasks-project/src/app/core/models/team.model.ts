export interface TeamMember {
  userId: number;
  email: string;
  name: string;
  role: 'owner' | 'member';
  joinedAt: Date;
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  ownerId: number;
  members: TeamMember[];
  members_count?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTeamDto {
  name: string;
  description?: string;
}

export interface AddMemberDto {
  userId: number;
  role: 'owner' | 'member';
}
