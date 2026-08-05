import { Component, OnInit, signal } from '@angular/core';
import { TeamService, TeamResponse } from '../../services/team-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-join-team',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './join-team.html',
  styleUrl: './join-team.css'
})
export class JoinTeam implements OnInit {

  teams = signal<TeamResponse[]>([]);
  isLoading = signal(true);

  username: string = '';

  constructor(
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('hackathon_username') || '';
    this.loadTeams();
  }

  loadTeams() {
    this.isLoading.set(true);

    this.teamService.getAllTeams()
      .subscribe({
        next: (data) => {
          console.log("TEAMS :", data);
          this.teams.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.isLoading.set(false);
        }
      });
  }

  join(teamId: number) {
    const request = {
      teamId: teamId,
      username: this.username
    };

    this.teamService.joinTeam(request)
      .subscribe({
        next: () => {
          alert("Vous avez rejoint l'équipe !");
          this.loadTeams();
        },
        error: (err) => {
          console.log(err);
          alert("Erreur lors de la demande");
        }
      });
  }

  showCreateForm = false;
  teamName = "";

  createTeamError = signal<string | null>(null);

  createTeam() {
    const request = {
      name: this.teamName,
      username: this.username
    };

    this.createTeamError.set(null);

    this.teamService.createTeam(request)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.showCreateForm = false;
          this.teamName = '';
          this.loadTeams();
        },
        error: (err) => {
          console.log(err);
          // Le backend renvoie { status, message, path, erros } dans le body ;
          // err.error contient ce body pour une reponse HTTP en erreur.
          const backendMessage = err.error?.message;
          this.createTeamError.set(backendMessage || "Erreur lors de la création de l'équipe.");
        }
      });
  }

}
