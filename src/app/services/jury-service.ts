import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface JuryProject {
  id: number;
  title: string;
  description: string;
  githubLink?: string;
  teamName: string;
  alreadyEvaluated: boolean;
}

export interface JuryResult {
  projectId: number;
  projectTitle: string;
  teamName: string;
  averageScore: number;
  evaluationCount: number;
}

export interface EvaluationRequest {
  projectId: number;
  score: number;
  comment?: string;
}

export interface Evaluation {
  id: number;
  score: number;
  comment?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class JuryService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/GestionHackaton_war_exploded/api/jury';

  getProjectsToEvaluate(): Observable<JuryProject[]> {
    return this.http.get<JuryProject[]>(`${this.apiUrl}/projects`);
  }

  evaluate(request: EvaluationRequest): Observable<Evaluation> {
    return this.http.post<Evaluation>(`${this.apiUrl}/evaluations`, request);
  }

  getResults(): Observable<JuryResult[]> {
    return this.http.get<JuryResult[]>(`${this.apiUrl}/results`);
  }
}
