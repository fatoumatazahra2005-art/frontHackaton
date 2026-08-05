import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface UserRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

const TOKEN_KEY = 'hackathon_token';
const USERNAME_KEY = 'hackathon_username';
const ROLE_KEY = 'hackathon_role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private apiUrl = "http://localhost:8080/GestionHackaton_war_exploded/api/auth";

  private tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private roleSignal = signal<string | null>(localStorage.getItem(ROLE_KEY));

  isAuthenticated = computed(() => !!this.tokenSignal());
  role = computed(() => this.roleSignal());

  register(user: UserRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, user)
      .pipe(tap(response => this.storeSession(response)));
  }

  login(user: UserRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, user)
      .pipe(tap(response => this.storeSession(response)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(ROLE_KEY);
    this.tokenSignal.set(null);
    this.roleSignal.set(null);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  hasRole(...roles: string[]): boolean {
    const current = this.roleSignal();
    return current !== null && roles.includes(current);
  }

  private storeSession(response: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USERNAME_KEY, response.username);
    localStorage.setItem(ROLE_KEY, response.role);
    this.tokenSignal.set(response.token);
    this.roleSignal.set(response.role);
  }
}
