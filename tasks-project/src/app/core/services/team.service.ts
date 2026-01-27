import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Team, CreateTeamDto, AddMemberDto } from '../models/team.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = environment.apiUrl;
  
  // Signal for teams list
  teams = signal<Team[]>([]);
  selectedTeam = signal<Team | null>(null);

  constructor(private http: HttpClient) {}

  // Get all teams for current user
  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/api/teams`).pipe(
      tap(teams => {
        console.log('Server response for getTeams:', JSON.stringify(teams, null, 2));
        teams.forEach((team, index) => {
          console.log(`Team ${index} - ID: ${team.id}, Name: ${team.name}, Members:`, team.members);
        });
        // Ensure all teams have members array
        const safeTeams = teams.map(team => ({
          ...team,
          members: team.members || []
        }));
        console.log('Safe teams after processing:', JSON.stringify(safeTeams, null, 2));
        this.teams.set(safeTeams);
      })
    );
  }

  // Get specific team
  getTeam(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/api/teams/${id}`).pipe(
      tap(team => this.selectedTeam.set(team))
    );
  }

  // Create new team
  createTeam(teamData: CreateTeamDto): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/api/teams`, teamData).pipe(
      tap(newTeam => {
        // Ensure new team has members array
        const safeTeam = { ...newTeam, members: newTeam.members || [] };
        this.teams.update(teams => [...teams, safeTeam]);
      })
    );
  }

  // Update team
  updateTeam(id: number, teamData: Partial<CreateTeamDto>): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/api/teams/${id}`, teamData).pipe(
      tap(updatedTeam => {
        this.teams.update(teams => 
          teams.map(team => team.id === id ? updatedTeam : team)
        );
      })
    );
  }

  // Delete team
  deleteTeam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/teams/${id}`).pipe(
      tap(() => {
        this.teams.update(teams => teams.filter(team => team.id !== id));
      })
    );
  }

  // Add member to team
  addMember(teamId: number, memberData: AddMemberDto): Observable<any> {
    console.log('Adding member:', { teamId, memberData });
    return this.http.post(`${this.apiUrl}/api/teams/${teamId}/members`, memberData).pipe(
      tap(response => console.log('Add member response:', response))
    );
  }

  // Get team members
  getTeamMembers(teamId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/teams/${teamId}/members`);
  }

  // Remove member from team
  removeMember(teamId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/teams/${teamId}/members/${userId}`);
  }
}
