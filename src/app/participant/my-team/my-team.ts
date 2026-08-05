import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TeamService, TeamResponse, TeamMemberResponse } from '../../services/team-service';
import { ParticipantService } from '../../services/participant-service';
import { Participant } from '../../models/participant';
import { ProjectService, Project } from '../../services/project-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-my-team',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './my-team.html',
  styleUrl: './my-team.css',
})
export class MyTeam implements OnInit {
  participant = signal<Participant | undefined>(undefined);
  team = signal<TeamResponse | undefined>(undefined);
  members = signal<TeamMemberResponse[]>([]);
  project = signal<Project | undefined>(undefined);
  allTeams = signal<TeamResponse[]>([]);
  loading = signal<boolean>(true);

  isCreator = computed(
    () =>
      !!this.participant() &&
      !!this.team() &&
      this.participant()!.username === this.team()!.createdBy,
  );

  newTeamName = '';
  editTeamName = '';
  selectedTeamIdToJoin: number | null = null;

  newProjectTitle = '';
  newProjectDescription = '';
  newProjectGithubLink = '';

  constructor(
    private teamService: TeamService,
    private participantService: ParticipantService,
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.participantService.getProfile().subscribe({
      next: (data) => {
        this.participant.set(data);
        this.loadMyTeam();
      },
      error: (err) => {
        console.log(err);
        this.loading.set(false);
      },
    });
  }

  loadMyTeam(): void {
    this.loading.set(true);

    this.teamService.getMyTeam().subscribe({
      next: (data) => {
        this.team.set(data ?? undefined);
        this.editTeamName = data?.name ?? '';

        if (data) {
          this.loadMembers(data.id);
          this.loadProject(data.id);
        } else {
          this.loadAllTeams();
        }

        this.loading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.team.set(undefined);
        this.loadAllTeams();
        this.loading.set(false);
      },
    });
  }

  loadAllTeams(): void {
    this.teamService.getAllTeams().subscribe({
      next: (data) => this.allTeams.set(data),
      error: (err) => console.log(err),
    });
  }

  loadMembers(teamId: number): void {
    this.teamService.getMembers(teamId).subscribe({
      next: (data) => this.members.set(data),
      error: (err) => console.log(err),
    });
  }

  loadProject(teamId: number): void {
    this.projectService.getProjectsByTeam(teamId).subscribe({
      next: (data) => this.project.set(data && data.length > 0 ? data[0] : undefined),
      error: (err) => console.log(err),
    });
  }

  createTeam(): void {
    const username = this.participant()?.username;
    if (!username || !this.newTeamName.trim()) return;

    this.teamService
      .createTeam({
        name: this.newTeamName.trim(),
        username: username,
      })
      .subscribe({
        next: () => {
          this.newTeamName = '';
          this.loadMyTeam();
        },
        error: (err) => console.log(err),
      });
  }

  joinTeam(): void {
    const username = this.participant()?.username;
    if (!username || this.selectedTeamIdToJoin == null) return;

    this.teamService
      .joinTeam({
        teamId: this.selectedTeamIdToJoin,
        username: username,
      })
      .subscribe({
        next: () => {
          this.selectedTeamIdToJoin = null;
          this.loadMyTeam();
        },
        error: (err) => console.log(err),
      });
  }

  leaveTeam(): void {
    const username = this.participant()?.username;
    if (!username) return;

    this.teamService.leaveTeam(username).subscribe({
      next: () => this.loadMyTeam(),
      error: (err) => console.log(err),
    });
  }

  updateTeamName(): void {
    const username = this.participant()?.username;
    const team = this.team();
    if (!username || !team || !this.editTeamName.trim()) return;

    this.teamService
      .updateTeam({
        teamId: team.id,
        name: this.editTeamName.trim(),
        username: username,
      })
      .subscribe({
        next: () => this.loadMyTeam(),
        error: (err) => console.log(err),
      });
  }

  updateProject(project: Project) {
    this.projectService
      .updateProject(project.id, {
        title: project.title,
        description: project.description,
        githubLink: project.githubLink,
      })
      .subscribe({
        next: (res) => {
          this.project.set(res);
        },
        error: (err) => console.log(err),
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  removeMember(memberUsername: string): void {
    const username = this.participant()?.username;
    const team = this.team();
    if (!username || !team) return;

    this.teamService
      .removeMember({
        teamId: team.id,
        usernameChef: username,
        usernameMember: memberUsername,
      })
      .subscribe({
        next: () => this.loadMembers(team.id),
        error: (err) => console.log(err),
      });
  }

  createProject(): void {
    const team = this.team();
    if (!team || !this.newProjectTitle.trim()) return;

    this.projectService
      .createProject(
        {
          title: this.newProjectTitle.trim(),
          description: this.newProjectDescription.trim(),
          githubLink: this.newProjectGithubLink.trim() || undefined,
        },
        team.id,
      )
      .subscribe({
        next: (data) => {
          this.project.set(data);
          this.newProjectTitle = '';
          this.newProjectDescription = '';
          this.newProjectGithubLink = '';
        },
        error: (err) => console.log(err),
      });
  }
}
