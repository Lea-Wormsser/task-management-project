import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/material.module';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: () => {
          this.snackBar.open('התחברת בהצלחה!', 'סגור', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/teams']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);
          
          let errorMessage = 'שגיאה בהתחברות. אנא נסה שוב.';
          
          // Check multiple possible error message locations
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.error) {
            errorMessage = error.error.error;
          } else if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.message) {
            errorMessage = error.message;
          } else if (error.status === 401) {
            errorMessage = 'אימייל או סיסמה שגויים';
          } else if (error.status === 404) {
            errorMessage = 'משתמש לא נמצא';
          } else if (error.status === 0) {
            errorMessage = 'שגיאת תקשורת לשרת';
          }
          
          this.snackBar.open(errorMessage, 'סגור', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  getEmailErrorMessage(): string {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'אימייל הוא שדה חובה';
    }
    if (emailControl?.hasError('email')) {
      return 'אנא הכנס אימייל תקין';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'סיסמה היא שדה חובה';
    }
    if (passwordControl?.hasError('minlength')) {
      return 'הסיסמה חייבת להכיל לפחות 6 תווים';
    }
    return '';
  }
}
