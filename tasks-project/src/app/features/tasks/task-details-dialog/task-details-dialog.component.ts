import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../shared/material.module';
import { Task } from '../../../core/models/task.model';
import { TaskCommentsComponent } from '../task-comments/task-comments.component';

@Component({
  selector: 'app-task-details-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, TaskCommentsComponent],
  templateUrl: './task-details-dialog.component.html',
  styleUrl: './task-details-dialog.component.scss'
})
export class TaskDetailsDialogComponent {
  task!: Task;

  constructor(
    public dialogRef: MatDialogRef<TaskDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task }
  ) {
    this.task = data.task;
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

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'backlog': 'ברשימה',
      'in_progress': 'בתהליך',
      'done': 'הושלם'
    };
    return labels[status] || status;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
