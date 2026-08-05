import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProjectRequest {
  title: string;
  description: string;
  githubLink?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  githubLink?: string;
  teamId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/GestionHackaton_war_exploded/api/projects';



  createProject(request: ProjectRequest, teamId: number): Observable<Project> {

    const token = localStorage.getItem('hackathon_token');

    return this.http.post<Project>(
      `${this.apiUrl}?teamId=${teamId}`,
      request,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }


  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }



  getProjectsByTeam(teamId: number): Observable<Project[]> {
    return this.http.get<Project[]>(
      `${this.apiUrl}/team/${teamId}`
    );
  }



  updateProject(id: number, request: ProjectRequest): Observable<Project> {
    return this.http.put<Project>(
      `${this.apiUrl}/${id}`,
      request
    );
  }



  getMyProject(): Observable<Project> {
    return this.http.get<Project>(
      `${this.apiUrl}/my-project`
    );
  }

}
