import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JuryService, JuryProject } from '../../services/jury-service';

@Component({
  selector: 'app-evaluation-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './evaluation-form.html',
  styleUrl: './evaluation-form.css'
})
export class EvaluationForm implements OnInit {

  project = signal<JuryProject | undefined>(undefined);
  loading = signal<boolean>(true);
  submitting = signal<boolean>(false);
  errorMessage = signal<string>('');

  score: number | null = null;
  comment = '';

  private projectId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private juryService: JuryService
  ) {}

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProject();
  }

  loadProject(): void {
    this.loading.set(true);

    this.juryService.getProjectsToEvaluate().subscribe({
      next: (data) => {
        const found = data.find(p => p.id === this.projectId);

        if (!found) {
          this.errorMessage.set('Projet introuvable.');
        } else if (found.alreadyEvaluated) {
          this.errorMessage.set('Ce projet a déjà été évalué.');
        } else {
          this.project.set(found);
        }

        this.loading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.errorMessage.set('Impossible de charger le projet.');
        this.loading.set(false);
      }
    });
  }

  submit(): void {
    if (this.score == null || this.score < 0 || this.score > 20) {
      this.errorMessage.set('Note invalide (0 à 20).');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');

    this.juryService.evaluate({
      projectId: this.projectId,
      score: this.score,
      comment: this.comment.trim() || undefined
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/jury']);
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(
          err?.error?.message || 'Ce projet a peut-être déjà été noté.'
        );
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/jury']);
  }
}
