import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationResults } from './evaluation-results';

describe('EvaluationResults', () => {
  let component: EvaluationResults;
  let fixture: ComponentFixture<EvaluationResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationResults],
    }).compileComponents();

    fixture = TestBed.createComponent(EvaluationResults);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
