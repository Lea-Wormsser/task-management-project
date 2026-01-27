import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/material.module';
import { TeamService } from '../../../core/services/team.service';
import { Team } from '../../../core/models/team.model';

@Component({
  selector: 'app-add-member-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './add-member-dialog.component.html',
  styleUrl: './add-member-dialog.component.scss'
})
export class AddMemberDialogComponent {
  memberForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private dialogRef: MatDialogRef<AddMemberDialogComponent>,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: { team: Team }
  ) {
    this.memberForm = this.fb.group({
      userId: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      role: ['member', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.memberForm.valid && !this.isLoading) {
      const formValue = this.memberForm.value;
      
      // Convert userId to number
      const memberData = {
        userId: Number(formValue.userId),
        role: formValue.role
      };

      // Set loading in next tick to avoid NG0100
      setTimeout(() => {
        this.isLoading = true;
      });

      this.teamService.addMember(this.data.team.id, memberData).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('החבר נוסף בהצלחה!', 'סגור', {
            duration: 3000
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error adding member:', error);
          
          let errorMessage = 'שגיאה בהוספת חבר';
          
          if (error.status === 404) {
            errorMessage = 'משתמש עם מזהה זה לא נמצא במערכת';
          } else if (error.status === 400) {
            errorMessage = error.error?.message || 'נתונים לא תקינים';
          } else if (error.status === 409) {
            errorMessage = 'משתמש זה כבר חבר בצוות';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          
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

  getUserIdErrorMessage(): string {
    const userIdControl = this.memberForm.get('userId');
    if (userIdControl?.hasError('required')) {
      return 'מזהה משתמש הוא שדה חובה';
    }
    if (userIdControl?.hasError('pattern')) {
      return 'אנא הכנס מספר תקין';
    }
    return '';
  }
}
