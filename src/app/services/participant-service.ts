import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Participant } from '../models/participant';


@Injectable({
  providedIn:'root'
})
export class ParticipantService {


  private http = inject(HttpClient);


  private apiUrl =
    "http://localhost:8080/GestionHackaton_war_exploded/api/users";


  /*getProfile(){

    return this.http.get<Participant>(
      `${this.apiUrl}/me`
    );

  }

   */

  getProfile(){
    return this.http.get<any>(`${this.apiUrl}/me`);
  }



  }
