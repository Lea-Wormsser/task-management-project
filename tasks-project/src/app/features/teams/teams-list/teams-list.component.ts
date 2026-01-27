import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/material.module';
import { TeamService } from '../../../core/services/team.service';
import { AuthService } from '../../../core/services/auth.service';
import { Team } from '../../../core/models/team.model';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './teams-list.component.html',
  styleUrl: './teams-list.component.scss'
})
export class TeamsListComponent implements OnInit {
  isLoading = signal(false);
  expandedTeams: { [key: number]: boolean } = {};

  constructor(
    public teamService: TeamService,
    public authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('TeamsListComponent ngOnInit called');
    console.log('Current user:', this.authService.currentUser());
    console.log('Is authenticated:', this.authService.isAuthenticated());
    this.loadTeams();
  }

  loadTeams(): void {
    console.log('loadTeams called, isLoading:', this.isLoading());
    
    this.isLoading.set(true);
    console.log('Calling teamService.getTeams()...');
    this.teamService.getTeams().subscribe({
      next: (teams) => {
        console.log('Teams loaded successfully:', teams);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading teams:', error);
        this.isLoading.set(false);
        this.snackBar.open('שגיאה בטעינת קבוצות', 'סגור', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  openCreateTeamDialog(): void {
    import('../create-team-dialog/create-team-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.CreateTeamDialogComponent, {
        width: '500px',
        direction: 'rtl'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadTeams();
        }
      });
    });
  }

  openAddMemberDialog(team: Team): void {
    import('../add-member-dialog/add-member-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.AddMemberDialogComponent, {
        width: '400px',
        direction: 'rtl',
        data: { team }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadTeams();
        }
      });
    });
  }

  removeMember(team: Team, userId: number): void {
    if (confirm('האם אתה בטוח שברצונך להסיר חבר זה מהצוות?')) {
      this.teamService.removeMember(team.id, userId).subscribe({
        next: () => {
          this.snackBar.open('החבר הוסר בהצלחה', 'סגור', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('שגיאה בהסרת חבר', 'סגור', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  deleteTeam(team: Team): void {
    if (confirm(`האם אתה בטוח שברצונך למחוק את הצוות "${team.name}"?`)) {
      this.teamService.deleteTeam(team.id).subscribe({
        next: () => {
          this.snackBar.open('הצוות נמחק בהצלחה', 'סגור', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('שגיאה במחיקת צוות', 'סגור', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  isOwner(team: Team): boolean {
    return team.ownerId === this.authService.currentUser()?.id;
  }

  toggleMembers(team: Team): void {
    const teamId = team.id;
    
    // If collapsing, just toggle
    if (this.expandedTeams[teamId]) {
      this.expandedTeams[teamId] = false;
      return;
    }
    
    // If expanding, load members first
    this.expandedTeams[teamId] = true;
    this.teamService.getTeamMembers(teamId).subscribe({
      next: (members) => {
        console.log(`Members loaded for team ${teamId}:`, members);
        // Update the team in the signal
        const teams = this.teamService.teams();
        const updatedTeams = teams.map(t => 
          t.id === teamId ? { ...t, members: members || [] } : t
        );
        this.teamService.teams.set(updatedTeams);
      },
      error: (error) => {
        console.error('Error loading members:', error);
        this.snackBar.open('שגיאה בטעינת חברי צוות', 'סגור', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  isTeamExpanded(teamId: number): boolean {
    return this.expandedTeams[teamId] === true;
  }

  logout(): void {
    this.authService.logout();
  }
}
