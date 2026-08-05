import { Component, OnInit, signal, computed } from '@angular/core';
import { JuryService, JuryResult } from '../../services/jury-service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  templateUrl: './leaderboard.html',
  imports: [DecimalPipe],
  styleUrl: './leaderboard.css',
})
export class Leaderboard implements OnInit {
  results = signal<JuryResult[]>([]);
  loading = signal<boolean>(true);

  ranked = computed(() => [...this.results()].sort((a, b) => b.averageScore - a.averageScore));

  podium = computed(() => this.ranked().slice(0, 3));
  rest = computed(() => this.ranked().slice(3));

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

  medal(index: number): string {
    return ['bi-trophy-fill', 'bi-award-fill', 'bi-award'][index] ?? '';
  }
}
