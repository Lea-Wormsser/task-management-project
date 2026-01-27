import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const teamsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./teams-list/teams-list.component')
      .then(m => m.TeamsListComponent),
    canActivate: [authGuard]
  }
];
