import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/material.module';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-create-project-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './create-project-dialog.component.html',
  styleUrl: './create-project-dialog.component.scss'
})
export class CreateProjectDialogComponent {
  projectForm: FormGroup;
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { teamId: number }
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.isLoading.set(true);

      const projectData = {
        ...this.projectForm.value,
        teamId: this.data.teamId
      };

      this.projectService.createProject(projectData).subscribe({
        next: () => {
          this.snackBar.open('הפרויקט נוצר בהצלחה', 'סגור', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isLoading.set(false);
          const errorMessage = error.error?.message || 'שגיאה ביצירת פרויקט';
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
