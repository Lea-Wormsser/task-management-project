import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

// export const routes: Routes = [
//   {
//     path: 'auth',
//     loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
//   },
//   {
//     path: 'home',
//     loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
//     canActivate: [authGuard]
//   },
//   {
//     path: 'teams',
//     loadChildren: () => import('./features/teams/teams.routes').then(m => m.teamsRoutes)
//   },
//   {
//     path: 'projects',
//     loadChildren: () => import('./features/projects/projects.routes').then(m => m.projectsRoutes)
//   },
//   {
//     path: 'tasks',
//     loadChildren: () => import('./features/tasks/tasks.routes').then(m => m.tasksRoutes)
//   },
//   {
//     path: '',
//     redirectTo: '/teams',
//     pathMatch: 'full'
//   }
// ];
export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard] // קיים
  },
  {
    path: 'teams',
    loadChildren: () => import('./features/teams/teams.routes').then(m => m.teamsRoutes),
    canActivate: [authGuard] // להוסיף כאן
  },
  {
    path: 'projects',
    loadChildren: () => import('./features/projects/projects.routes').then(m => m.projectsRoutes),
    canActivate: [authGuard] // להוסיף כאן
  },
  {
    path: 'tasks',
    loadChildren: () => import('./features/tasks/tasks.routes').then(m => m.tasksRoutes),
    canActivate: [authGuard] // להוסיף כאן
  },
  {
    path: '',
    redirectTo: '/teams',
    pathMatch: 'full'
  }
];
