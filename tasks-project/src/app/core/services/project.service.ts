import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Project, CreateProjectDto } from '../models/project.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = environment.apiUrl;
  
  projects = signal<Project[]>([]);
  selectedProject = signal<Project | null>(null);

  constructor(private http: HttpClient) {}

  // Get all projects for a team
  getProjectsByTeam(teamId: number): Observable<Project[]> {
    console.log('getProjectsByTeam called with teamId:', teamId);
    return this.http.get<Project[]>(`${this.apiUrl}/api/projects`).pipe(
      tap(allProjects => {
        console.log('All projects from server:', allProjects);
        // Filter projects by team_id (server uses snake_case)
        const teamProjects = allProjects.filter(p => p.team_id === teamId);
        console.log('Filtered projects for team', teamId, ':', teamProjects);
        this.projects.set(teamProjects);
      })
    );
  }

  // Get specific project
  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/api/projects/${id}`).pipe(
      tap(project => this.selectedProject.set(project))
    );
  }

  // Create new project
  createProject(projectData: CreateProjectDto): Observable<Project> {
    console.log('Creating project with data:', projectData);
    return this.http.post<Project>(`${this.apiUrl}/api/projects`, projectData).pipe(
      tap(createdProject => console.log('Project created:', createdProject))
    );
  }

  // Update project
  updateProject(id: number, projectData: Partial<CreateProjectDto>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/api/projects/${id}`, projectData).pipe(
      tap(updatedProject => {
        this.projects.update(projects => 
          projects.map(project => project.id === id ? updatedProject : project)
        );
      })
    );
  }

  // Delete project
  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/projects/${id}`).pipe(
      tap(() => {
        this.projects.update(projects => projects.filter(project => project.id !== id));
      })
    );
  }
}
