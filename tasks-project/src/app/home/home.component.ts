import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from '../shared/material.module';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <div class="home-container">
      <mat-toolbar color="primary">
        <span>ברוך הבא, {{ authService.currentUser()?.name }}!</span>
        <span class="spacer"></span>
        <button mat-button (click)="navigateToTeams()">
          <mat-icon>groups</mat-icon>
          הקבוצות שלי
        </button>
        <button mat-button (click)="logout()">
          <mat-icon>logout</mat-icon>
          התנתק
        </button>
      </mat-toolbar>

      <div class="content">
        <mat-card>
          <mat-card-header>
            <mat-card-title>מערכת ניהול משימות</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>התחברת בהצלחה למערכת!</p>
            <div class="nav-buttons">
              <button mat-raised-button color="primary" (click)="navigateToTeams()">
                <mat-icon>groups</mat-icon>
                עבור לקבוצות
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .content {
      flex: 1;
      padding: 40px;
      background: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    mat-card {
      max-width: 600px;
      width: 100%;
      text-align: center;
      padding: 30px;
    }

    mat-card-title {
      font-size: 24px;
      margin-bottom: 20px;
    }

    p {
      font-size: 16px;
      line-height: 1.6;
      color: #666;
      margin: 10px 0;
    }

    .nav-buttons {
      margin-top: 30px;
      display: flex;
      gap: 16px;
      justify-content: center;
    }

    .nav-buttons button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    mat-toolbar button {
      margin-right: 8px;
    }
  `]
})
export class HomeComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
  }

  navigateToTeams(): void {
    this.router.navigate(['/teams']);
  }
}
