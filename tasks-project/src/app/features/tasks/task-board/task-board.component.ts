import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/material.module';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { AuthService } from '../../../core/services/auth.service';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, MaterialModule, DragDropModule],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.scss'
})
export class TaskBoardComponent implements OnInit {
  isLoading = signal(false);
  projectId: number = 0;
  projectName: string = '';

  backlogTasks = signal<Task[]>([]);
  inProgressTasks = signal<Task[]>([]);
  doneTasks = signal<Task[]>([]);

  constructor(
    public taskService: TaskService,
    public projectService: ProjectService,
    public authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = +params['projectId'];
      this.loadProjectInfo();
      this.loadTasks();
    });
  }

  loadProjectInfo(): void {
    const project = this.projectService.projects().find(p => p.id === this.projectId);
    if (project) {
      this.projectName = project.name;
    }
  }

  loadTasks(): void {
    this.isLoading.set(true);
    this.taskService.getTasksByProject(this.projectId).subscribe({
      next: () => {
        this.organizeTasks();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.isLoading.set(false);
        this.snackBar.open('שגיאה בטעינת משימות', 'סגור', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  organizeTasks(): void {
    const allTasks = this.taskService.tasks();
    this.backlogTasks.set(allTasks.filter(t => t.status === 'backlog'));
    this.inProgressTasks.set(allTasks.filter(t => t.status === 'in_progress'));
    this.doneTasks.set(allTasks.filter(t => t.status === 'done'));
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: string): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      
      // Update task status on server
      this.taskService.updateTask(task.id, { status: newStatus as any }).subscribe({
        next: () => {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          this.loadTasks(); // Reload to sync with server
        },
        error: () => {
          this.snackBar.open('שגיאה בעדכון משימה', 'סגור', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  openCreateTaskDialog(status: string): void {
    import('../create-task-dialog/create-task-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.CreateTaskDialogComponent, {
        width: '500px',
        direction: 'rtl',
        data: { projectId: this.projectId, status }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadTasks();
        }
      });
    });
  }

  openTaskDetails(task: Task): void {
    import('../task-details-dialog/task-details-dialog.component').then(m => {
      this.dialog.open(m.TaskDetailsDialogComponent, {
        width: '700px',
        maxHeight: '90vh',
        direction: 'rtl',
        data: { task }
      });
    });
  }

  deleteTask(task: Task): void {
    if (confirm(`האם אתה בטוח שברצונך למחוק את המשימה "${task.title}"?`)) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.snackBar.open('המשימה נמחקה בהצלחה', 'סגור', { duration: 3000 });
          this.loadTasks();
        },
        error: () => {
          this.snackBar.open('שגיאה במחיקת משימה', 'סגור', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  getPriorityColor(priority: string): string {
    const colors: { [key: string]: string } = {
      'high': '#ef4444',
      'medium': '#f59e0b',
      'low': '#10b981'
    };
    return colors[priority] || '#6b7280';
  }

  getPriorityLabel(priority: string): string {
    const labels: { [key: string]: string } = {
      'high': 'גבוה',
      'medium': 'בינוני',
      'low': 'נמוך'
    };
    return labels[priority] || priority;
  }

  goBack(): void {
    // Navigate back to projects, need to get team_id from project
    const project = this.projectService.projects().find(p => p.id === this.projectId);
    if (project) {
      this.router.navigate(['/projects', project.team_id]);
    } else {
      this.router.navigate(['/teams']);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
