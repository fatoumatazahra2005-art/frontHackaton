import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserModel } from '../models/user-model';

@Service()
export class UserService {

  private httpClient = inject(HttpClient);
  private API = "http://localhost:8080/GestionHackaton_war_exploded/api/users";

  getAllUsers() {
    return this.httpClient.get<UserModel[]>(this.API);
  }

  getUserById(id: number) {
    return this.httpClient.get<UserModel>(`${this.API}/${id}`);
  }

  addUser(user: any) {
    return this.httpClient.post<UserModel>(this.API, user);
  }

  updateUser(id: number, user: UserModel) {
    return this.httpClient.put<UserModel>(`${this.API}/${id}`, user);
  }

  deleteUser(id: number) {
    return this.httpClient.delete<void>(`${this.API}/${id}`);
  }

}
