import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/material.module';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { email, password, name } = this.registerForm.value;

      this.authService.register(email, password, name).subscribe({
        next: () => {
          this.snackBar.open('נרשמת בהצלחה! מעביר אותך...', 'סגור', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/teams']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Register error:', error);
          
          let errorMessage = 'שגיאה בהרשמה. אנא נסה שוב.';
          
          // Check multiple possible error message locations
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.error) {
            errorMessage = error.error.error;
          } else if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.message) {
            errorMessage = error.message;
          } else if (error.status === 409) {
            errorMessage = 'משתמש עם אימייל זה כבר קיים';
          } else if (error.status === 400) {
            errorMessage = 'פרטים לא תקינים';
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

  getNameErrorMessage(): string {
    const nameControl = this.registerForm.get('name');
    if (nameControl?.hasError('required')) {
      return 'שם הוא שדה חובה';
    }
    if (nameControl?.hasError('minlength')) {
      return 'השם חייב להכיל לפחות 2 תווים';
    }
    return '';
  }

  getEmailErrorMessage(): string {
    const emailControl = this.registerForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'אימייל הוא שדה חובה';
    }
    if (emailControl?.hasError('email')) {
      return 'אנא הכנס אימייל תקין';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    const passwordControl = this.registerForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'סיסמה היא שדה חובה';
    }
    if (passwordControl?.hasError('minlength')) {
      return 'הסיסמה חייבת להכיל לפחות 6 תווים';
    }
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    const confirmPasswordControl = this.registerForm.get('confirmPassword');
    if (confirmPasswordControl?.hasError('required')) {
      return 'אימות סיסמה הוא שדה חובה';
    }
    if (this.registerForm.hasError('passwordMismatch') && confirmPasswordControl?.touched) {
      return 'הסיסמאות אינן תואמות';
    }
    return '';
  }
}
