import { Component, OnInit, signal } from '@angular/core';
import { JuryService, JuryResult } from '../../services/jury-service';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-evaluation-results',
  standalone: true,
  templateUrl: './evaluation-results.html',
  imports: [DecimalPipe, RouterLink],
  styleUrl: './evaluation-results.css',
})
export class EvaluationResults implements OnInit {
  results = signal<JuryResult[]>([]);
  loading = signal<boolean>(true);

  constructor(private juryService: JuryService) {}

  ngOnInit(): void {
    this.juryService.getResults().subscribe({
      next: (data) => {
        this.results.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.loading.set(false);
      },
    });
  }
}
