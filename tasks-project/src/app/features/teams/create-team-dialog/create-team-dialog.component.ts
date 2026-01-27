import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/material.module';
import { TeamService } from '../../../core/services/team.service';

@Component({
  selector: 'app-create-team-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './create-team-dialog.component.html',
  styleUrl: './create-team-dialog.component.scss'
})
export class CreateTeamDialogComponent {
  teamForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private dialogRef: MatDialogRef<CreateTeamDialogComponent>,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.teamForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.teamForm.valid) {
      this.isLoading = true;
      this.cdr.detectChanges();
      const teamData = this.teamForm.value;

      this.teamService.createTeam(teamData).subscribe({
        next: (team) => {
          this.isLoading = false;
          this.snackBar.open('הצוות נוצר בהצלחה!', 'סגור', {
            duration: 3000
          });
          this.dialogRef.close(team);
        },
        error: (error) => {
          this.isLoading = false;
          const errorMessage = error.error?.message || 'שגיאה ביצירת צוות';
          this.snackBar.open(errorMessage, 'סגור', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getNameErrorMessage(): string {
    const nameControl = this.teamForm.get('name');
    if (nameControl?.hasError('required')) {
      return 'שם הצוות הוא שדה חובה';
    }
    if (nameControl?.hasError('minlength')) {
      return 'שם הצוות חייב להכיל לפחות 2 תווים';
    }
    return '';
  }
}
