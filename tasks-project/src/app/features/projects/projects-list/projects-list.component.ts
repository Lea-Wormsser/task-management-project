import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/material.module';
import { ProjectService } from '../../../core/services/project.service';
import { TeamService } from '../../../core/services/team.service';
import { AuthService } from '../../../core/services/auth.service';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss'
})
export class ProjectsListComponent implements OnInit {
  isLoading = signal(false);
  teamId: number = 0;
  teamName: string = '';

  constructor(
    public projectService: ProjectService,
    public teamService: TeamService,
    public authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.teamId = +params['teamId'];
      this.loadTeamInfo();
      this.loadProjects();
    });
  }

  loadTeamInfo(): void {
    const team = this.teamService.teams().find(t => t.id === this.teamId);
    if (team) {
      this.teamName = team.name;
    }
  }

  loadProjects(): void {
    this.isLoading.set(true);
    this.projectService.getProjectsByTeam(this.teamId).subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.isLoading.set(false);
        this.snackBar.open('שגיאה בטעינת פרויקטים', 'סגור', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  openCreateProjectDialog(): void {
    import('../create-project-dialog/create-project-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.CreateProjectDialogComponent, {
        width: '500px',
        direction: 'rtl',
        data: { teamId: this.teamId }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadProjects();
        }
      });
    });
  }

  deleteProject(project: Project): void {
    if (confirm(`האם אתה בטוח שברצונך למחוק את הפרויקט "${project.name}"?`)) {
      this.snackBar.open('מחיקת פרויקטים לא נתמכת כרגע', 'סגור', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'active': 'פעיל',
      'completed': 'הושלם',
      'archived': 'בארכיון'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'active': 'primary',
      'completed': 'accent',
      'archived': 'warn'
    };
    return colors[status] || '';
  }

  goBack(): void {
    this.router.navigate(['/teams']);
  }

  logout(): void {
    this.authService.logout();
  }
}
