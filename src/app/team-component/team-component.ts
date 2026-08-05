import { Component, inject, signal } from '@angular/core';
import { TeamMemberResponse, TeamResponse, TeamService } from '../services/team-service';

@Component({
  selector: 'app-team-component',
  imports: [],
  templateUrl: './team-component.html',
  styleUrl: './team-component.css',
})
export class TeamComponent {
  protected teams = signal<TeamResponse[]>([]);
  protected members = signal<TeamMemberResponse[]>([]);

  private teamService = inject(TeamService);

  selectedTeam = signal<TeamResponse | null>(null);
  showModal = signal(false);

  ngOnInit() {
    this.getAllTeams();
  }

  getAllTeams() {
    this.teamService.getAllTeams().subscribe((res) => {
      console.log(res);

      this.teams.set(res);
    });
  }

  getMembers(teamId: number) {
    this.teamService.getMembers(teamId).subscribe({
      next: (res) => {
        console.log(res);

        this.members.set(res);
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  openMembers(team: TeamResponse) {
    this.selectedTeam.set(team);

    this.getMembers(team.id);

    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);

    this.selectedTeam.set(null);
  }
}
