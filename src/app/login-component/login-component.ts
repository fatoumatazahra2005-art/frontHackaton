import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth-service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = {
    username: '',
    password: '',
  };

  errorMessage = '';

  login() {
    this.authService.login(this.user).subscribe({
      next: (res: any) => {
        console.log('Utilisateur connecté :', res);

        switch (res.role) {
          case 'ROLE_ADMIN':
            this.router.navigate(['/dashboard']);
            break;

          case 'ROLE_JURY':
            this.router.navigate(['/jury']);
            break;

          case 'ROLE_PARTICIPANT':
          default:
            this.router.navigate(['/participant/my-team']);
            break;
        }
      },

      error: (err: HttpErrorResponse) => {
        console.log('Erreur :', err.message);
        this.errorMessage = "Nom d'utilisateur ou mot de passe incorrect.";
      },
    });
  }
}
