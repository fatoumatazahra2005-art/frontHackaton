import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { JuryService, JuryProject } from '../../services/jury-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-jury-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './jury-dashboard.html',
  styleUrl: './jury-dashboard.css'
})
export class JuryDashboard implements OnInit {

  projects = signal<JuryProject[]>([]);
  loading = signal<boolean>(true);

  constructor(
    private juryService: JuryService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading.set(true);
    this.juryService.getProjectsToEvaluate().subscribe({
      next: (data) => {
        this.projects.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.loading.set(false);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
