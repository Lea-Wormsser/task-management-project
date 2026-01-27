// import { CanActivateFn, Router } from '@angular/router';
// import { inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';

// export const authGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);
//   const platformId = inject(PLATFORM_ID);

//   // In SSR (server-side), always allow - browser will check again
//   if (!isPlatformBrowser(platformId)) {
//     console.log('[AuthGuard] SSR detected, allowing access');
//     return true;
//   }

//   console.log('[AuthGuard] Checking authentication for:', state.url);

//   const token = localStorage.getItem('auth_token');
//   console.log('[AuthGuard] Token exists:', !!token);
  
//   if (token) {
//     try {
//       // Check if token is expired
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       const now = Date.now() / 1000; // Convert to seconds
//       const isExpired = payload.exp && payload.exp < now;
      
//       console.log('[AuthGuard] Token exp:', payload.exp, 'Now:', now, 'Expired:', isExpired);
      
//       if (!isExpired) {
//         // Token is valid
//         console.log('[AuthGuard] Access granted ✓');
//         return true;
//       } else {
//         console.log('[AuthGuard] Token expired, removing...');
//         localStorage.removeItem('auth_token');
//       }
//     } catch (error) {
//       // Invalid token, remove it
//       console.error('[AuthGuard] Invalid token:', error);
//       localStorage.removeItem('auth_token');
//     }
//   }

//   // No valid token, redirect to login
//   console.log('[AuthGuard] Redirecting to login from:', state.url);
//   router.navigate(['/auth/login'], {
//     queryParams: { returnUrl: state.url }
//   });
//   return false;
// };
import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // בדיקה אם אנחנו בדפדפן - localStorage זמין רק כאן
  if (!isPlatformBrowser(platformId)) {
    return true; 
  }

  const token = localStorage.getItem('auth_token');

  if (token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT structure');

      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp > now) {
        return true; // הטוקן תקין ובתוקף
      }
      
      // אם הגענו לכאן, הטוקן פג תוקף
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('[AuthGuard] Error parsing token:', error);
      localStorage.removeItem('auth_token');
    }
  }

  // הפניה להתחברות
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};