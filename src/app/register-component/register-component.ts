import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';


@Component({
  selector: 'app-register-component',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {


  private authService = inject(AuthService);
  private router = inject(Router);


  user = {
    username: '',
    password: ''
  };

  errorMessage = '';


  register(){

    this.authService.register(this.user)
      .subscribe({

        next:(res)=>{

          console.log("Compte créé :", res);
          this.router.navigate(['/login']);

        },

        error:(err)=>{

          console.log("Erreur :", err);
          this.errorMessage = 'Impossible de créer le compte. Le nom d\'utilisateur est peut-être déjà pris.';

        }

      });

  }

}
