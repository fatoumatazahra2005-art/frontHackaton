import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ProjectService, Project } from '../services/project-service';

interface TeamMember {
  id: number;
  username: string;
}

interface ProjectTeamDetails {
  teamId: number;
  teamName: string;
  createdBy: string;
  members: TeamMember[];
}

@Component({
  selector: 'app-project-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-component.html',
  styleUrl: './project-component.css',
})
export class ProjectComponent implements OnInit {

  private projectService = inject(ProjectService);
  private http = inject(HttpClient);

  private apiUrl = "http://localhost:8080/GestionHackaton_war_exploded/api/projects";

  projects = signal<Project[]>([]);
  selectedProject = signal<Project | null>(null);

  showModal = signal(false);
  loading = signal(false);
  errorMessage = signal('');

  // Etat de l'equipe liee au projet actuellement affiche dans le modal.
  projectTeam = signal<ProjectTeamDetails | null>(null);
  isLoadingTeam = signal(false);
  teamError = signal<string | null>(null);


  ngOnInit() {
    this.getAllProjects();
  }


  // 🔹 ADMIN : voir tous les projets
  getAllProjects() {

    this.loading.set(true);

    this.projectService.getAllProjects()
      .subscribe({

        next: (res) => {
          console.log("PROJECTS :", res);
          this.projects.set(res);
          this.loading.set(false);
        },

        error: (err) => {
          console.log(err);
          this.errorMessage.set("Erreur lors du chargement des projets");
          this.loading.set(false);
        }

      });
  }


  // 🔹 OPTION : projets d'une équipe
  getProjectsByTeam(teamId: number) {

    this.loading.set(true);

    this.projectService.getProjectsByTeam(teamId)
      .subscribe({

        next: (res) => {
          this.projects.set(res);
          this.loading.set(false);
        },

        error: (err) => {
          console.log(err);
          this.loading.set(false);
        }

      });
  }


  // 🔹 OPTION : projet de MON équipe
  loadMyProject() {

    this.loading.set(true);

    this.projectService.getMyProject()
      .subscribe({

        next: (res) => {
          this.projects.set([res]); // tableau avec un seul projet
          this.loading.set(false);
        },

        error: (err) => {
          console.log(err);
          this.loading.set(false);
        }

      });
  }


  openDetails(project: Project) {
    this.selectedProject.set(project);
    this.showModal.set(true);
    this.loadProjectTeam(project.id);
  }


  loadProjectTeam(projectId: number) {

    this.isLoadingTeam.set(true);
    this.teamError.set(null);
    this.projectTeam.set(null);

    this.http.get<ProjectTeamDetails>(`${this.apiUrl}/${projectId}/team`)
      .subscribe({
        next: (data) => {
          this.projectTeam.set(data);
          this.isLoadingTeam.set(false);
        },
        error: (err) => {
          console.log(err);
          this.teamError.set("Impossible de charger l'équipe liée à ce projet.");
          this.isLoadingTeam.set(false);
        }
      });
  }


  closeModal() {
    this.showModal.set(false);
    this.selectedProject.set(null);
    this.projectTeam.set(null);
    this.teamError.set(null);
  }

}
