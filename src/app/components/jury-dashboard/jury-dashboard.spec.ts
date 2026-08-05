import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuryDashboard } from './jury-dashboard';

describe('JuryDashboard', () => {
  let component: JuryDashboard;
  let fixture: ComponentFixture<JuryDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JuryDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(JuryDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
