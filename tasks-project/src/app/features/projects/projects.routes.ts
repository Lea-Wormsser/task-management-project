import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const projectsRoutes: Routes = [
  {
    path: ':teamId',
    loadComponent: () => import('./projects-list/projects-list.component')
      .then(m => m.ProjectsListComponent),
    canActivate: [authGuard]
  }
];
