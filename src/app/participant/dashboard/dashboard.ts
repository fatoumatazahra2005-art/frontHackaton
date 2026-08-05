import { Component, OnInit, inject, signal } from '@angular/core';

import { ParticipantService } from '../../services/participant-service';
import { Participant } from '../../models/participant';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  imports: [RouterLink],
})
export class DashboardComponent implements OnInit {
  private participantService = inject(ParticipantService);
  private router = inject(Router);

  participant = signal<Participant | undefined>(undefined);

  ngOnInit() {
    this.loadParticipant();
  }

  loadParticipant() {
    this.participantService.getProfile().subscribe({
      next: (data) => {
        console.log(data);
        this.participant.set(data);
      },
      error: (err) => {
        console.error('Erreur chargement profil :', err);
      },
    });
  }

  joinTeam() {
    this.router.navigate(['/participant/join-team']);
  }
}
