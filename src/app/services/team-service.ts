import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user-model';

export interface Team {
  id: number;
  name: string;
}

export interface TeamResponse {
  id:number;
  name:string;
  createdBy:string;
  members?:any[];
}

export interface TeamMemberResponse {
  username: string;
  id:number;
}

export interface CreateTeamRequest {
  name: string;
  username: string;
}

export interface JoinTeamRequest {
  teamId: number;
  username: string;
}

export interface UpdateTeamRequest {
  teamId: number;
  name: string;
  username: string;
}

export interface RemoveMemberRequest {
  teamId: number;
  usernameChef: string;
  usernameMember: string;
}


@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private apiUrl =  'http://localhost:8080/GestionHackaton_war_exploded/api/teams';

  constructor(private http: HttpClient) {}



  createTeam(request: CreateTeamRequest): Observable<Team> {
    return this.http.post<Team>(
      `${this.apiUrl}/create`,
      request
    );
  }



  joinTeam(request: JoinTeamRequest): Observable<Team> {
    return this.http.post<Team>(
      `${this.apiUrl}/join`,
      request
    );
  }


  // POST /api/teams/leave
  leaveTeam(username: string): Observable<string> {

    return this.http.post(
      `${this.apiUrl}/leave`,
      {
        username: username
      },
      {
        responseType: 'text'
      }
    );
  }


  // PUT /api/teams/update
  updateTeam(request: UpdateTeamRequest): Observable<Team> {

    return this.http.put<Team>(
      `${this.apiUrl}/update`,
      request
    );
  }


  // GET /api/teams




  private httpClient = inject(HttpClient);
  private API = 'http://localhost:8080/GestionHackaton_war_exploded/api/teams';

  getAllTeams() {
    return this.httpClient.get<TeamResponse[]>(this.API);
  }


  // POST /api/teams/remove-member
  removeMember(request: RemoveMemberRequest): Observable<string> {

    return this.http.post(
      `${this.apiUrl}/remove-member`,
      request,
      {
        responseType: 'text'
      }
    );
  }


  // GET /api/teams/{teamId}/members
  getMembers(teamId: number): Observable<TeamMemberResponse[]> {

    return this.http.get<TeamMemberResponse[]>(
      `${this.apiUrl}/${teamId}/members`
    );
  }

  getMyTeam(): Observable<TeamResponse> {

    return this.http.get<TeamResponse>(
      `${this.apiUrl}/my-team`
    );

  }

}
