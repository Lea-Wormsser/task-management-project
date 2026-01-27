import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/material.module';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-create-task-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './create-task-dialog.component.html',
  styleUrl: './create-task-dialog.component.scss'
})
export class CreateTaskDialogComponent {
  taskForm: FormGroup;
  isLoading = signal(false);

  priorities = [
    { value: 'low', label: 'נמוך' },
    { value: 'medium', label: 'בינוני' },
    { value: 'high', label: 'גבוה' }
  ];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projectId: number; status: string }
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      priority: ['medium', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.isLoading.set(true);

      const taskData = {
        ...this.taskForm.value,
        projectId: this.data.projectId,
        status: this.data.status
      };

      this.taskService.createTask(taskData).subscribe({
        next: () => {
          this.snackBar.open('המשימה נוצרה בהצלחה', 'סגור', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isLoading.set(false);
          const errorMessage = error.error?.message || 'שגיאה ביצירת משימה';
          this.snackBar.open(errorMessage, 'סגור', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
