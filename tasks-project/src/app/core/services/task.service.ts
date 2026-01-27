import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Task, CreateTaskDto, UpdateTaskDto } from '../models/task.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.apiUrl;
  
  tasks = signal<Task[]>([]);

  constructor(private http: HttpClient) {}

  // Get all tasks for a project
  getTasksByProject(projectId: number): Observable<Task[]> {
    const params = new HttpParams().set('projectId', projectId.toString());
    return this.http.get<Task[]>(`${this.apiUrl}/api/tasks`, { params }).pipe(
      tap(tasks => this.tasks.set(tasks))
    );
  }

  // Create new task
  createTask(taskData: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/api/tasks`, taskData);
  }

  // Update task
  updateTask(id: number, taskData: UpdateTaskDto): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/api/tasks/${id}`, taskData);
  }

  // Delete task
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/tasks/${id}`);
  }

  // Group tasks by status
  getTasksByStatus(status: string): Task[] {
    return this.tasks().filter(task => task.status === status);
  }
}
