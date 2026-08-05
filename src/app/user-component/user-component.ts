import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserModel } from '../models/user-model';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-user-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-component.html',
  styleUrl: './user-component.css',
})
export class UserComponent implements OnInit {
  protected users = signal<UserModel[]>([]);
  private userService = inject(UserService);

  ngOnInit() {
    this.getAllUsers();
  }

  public getAllUsers() {
    this.userService.getAllUsers().subscribe((res) => {
      console.log(res);
      this.users.set(res);
    });
  }

  public delete(id: number) {
    this.userService.deleteUser(id).subscribe((res) => {
      this.getAllUsers();
    });
  }

  // --- Ajout d'un utilisateur ---

  showAddForm = signal(false);

  newUser = {
    username: '',
    password: '',
    role: 'ROLE_PARTICIPANT'
  };

  addError = signal<string | null>(null);
  isAdding = signal(false);

  openAddForm(): void {
    this.showAddForm.set(true);
    this.newUser = { username: '', password: '', role: 'ROLE_PARTICIPANT' };
    this.addError.set(null);
  }

  closeAddForm(): void {
    this.showAddForm.set(false);
  }

  addUser(): void {
    if (!this.newUser.username.trim() || !this.newUser.password.trim()) {
      this.addError.set("Le nom d'utilisateur et le mot de passe sont obligatoires.");
      return;
    }

    this.isAdding.set(true);
    this.addError.set(null);

    this.userService.addUser(this.newUser).subscribe({
      next: () => {
        this.isAdding.set(false);
        this.showAddForm.set(false);
        this.getAllUsers();
      },
      error: (err) => {
        console.error(err);
        this.isAdding.set(false);
        const backendMessage = err.error?.message;
        this.addError.set(backendMessage || "Erreur lors de la création de l'utilisateur.");
      }
    });
  }
}
