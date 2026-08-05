import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface AdminUser {
  id: number;
  username: string;
  role: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css'
})
export class DashboardComponent implements OnInit {

  private http = inject(HttpClient);
  private baseUrl = "http://localhost:8080/GestionHackaton_war_exploded/api";

  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  stats = signal({
    users: 0,
    teams: 0,
    projects: 0
  });

  recentParticipants = signal<AdminUser[]>([]);

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    let usersData: AdminUser[] = [];
    let teamsCount = 0;
    let projectsCount = 0;
    let completed = 0;

    const onOneComplete = () => {
      completed++;
      if (completed === 3) {
        this.stats.set({ users: usersData.length, teams: teamsCount, projects: projectsCount });


        const participants = usersData
          .filter(u => u.role === 'ROLE_PARTICIPANT')
          .sort((a, b) => b.id - a.id)
          .slice(0, 5);

        this.recentParticipants.set(participants);
        this.isLoading.set(false);
      }
    };

    this.http.get<AdminUser[]>(`${this.baseUrl}/users`).subscribe({
      next: (data) => { usersData = data; onOneComplete(); },
      error: (err) => { console.error(err); this.errorMessage.set("Erreur de chargement."); onOneComplete(); }
    });

    this.http.get<any[]>(`${this.baseUrl}/teams`).subscribe({
      next: (data) => { teamsCount = data.length; onOneComplete(); },
      error: (err) => { console.error(err); this.errorMessage.set("Erreur de chargement."); onOneComplete(); }
    });

    this.http.get<any[]>(`${this.baseUrl}/projects`).subscribe({
      next: (data) => { projectsCount = data.length; onOneComplete(); },
      error: (err) => { console.error(err); this.errorMessage.set("Erreur de chargement."); onOneComplete(); }
    });
  }
}
