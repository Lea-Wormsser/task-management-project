import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const tasksRoutes: Routes = [
  {
    path: ':projectId',
    loadComponent: () => import('./task-board/task-board.component')
      .then(m => m.TaskBoardComponent),
    canActivate: [authGuard]
  }
];
