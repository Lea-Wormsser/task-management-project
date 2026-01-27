import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { AuthResponse } from '../models/auth-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private apiUrl = environment.apiUrl;
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Signals for user state
  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Force load user from token immediately
    if (this.isBrowser) {
      this.loadUserFromToken();
    }
  }

  register(email: string, password: string, name: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/register`, {
      email,
      password,
      name
    }).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/login`, {
      email,
      password
    }).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Check if token is expired
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  private saveToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  private handleAuthResponse(response: AuthResponse): void {
    this.saveToken(response.token);
    this.currentUser.set(response.user);
  }

  // private loadUserFromToken(): void {
  //   if (!this.isBrowser) {
  //     return;
  //   }
    
  //   const token = this.getToken();
  //   if (token) {
  //     // Decode JWT token to get user info
  //     try {
  //       const payload = JSON.parse(atob(token.split('.')[1]));
  //       this.currentUser.set({
  //         id: payload.id || payload.userId,
  //         email: payload.email,
  //         name: payload.name
  //       });
  //     } catch (error) {
  //       console.error('Failed to parse token:', error);
  //       if (this.isBrowser) {
  //         localStorage.removeItem(this.TOKEN_KEY);
  //       }
  //     }
  //   }
  // }


  private loadUserFromToken(): void {
  // אם אנחנו לא בדפדפן, אין לנו גישה לטוקן ב-LocalStorage
  if (!this.isBrowser) return;
  
  const token = this.getToken();
  if (token && this.hasValidToken()) { // הוספת בדיקת תוקף כאן
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUser.set({
        id: payload.id || payload.userId,
        email: payload.email,
        name: payload.name,
       // role: payload.role // וודאי שהשדות תואמים ל-Payload שלך
      });
      console.log('User loaded from token successfully');
    } catch (error) {
      console.error('Failed to parse token:', error);
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }
}

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/api/auth/me`);
  }
}
