import { Routes } from '@angular/router';

import { LoginComponent } from './login-component/login-component';
import { RegisterComponent } from './register-component/register-component';

import { LayoutComponent } from './admin/layout-component/layout-component';
import { DashboardComponent as AdminDashboardComponent }
  from './admin/dashboard-component/dashboard-component';

import { UserComponent } from './user-component/user-component';
import { TeamComponent } from './team-component/team-component';
import { ProjectComponent } from './project-component/project-component';

import { DashboardComponent as ParticipantDashboardComponent }
  from './participant/dashboard/dashboard';

import { JoinTeam } from './participant/join-team/join-team';

import { authGuard, roleGuard } from './guards/auth.gard';
import { JuryDashboard } from './components/jury-dashboard/jury-dashboard';
import { EvaluationForm } from './components/evaluation-form/evaluation-form';
import { EvaluationResults } from './components/evaluation-results/evaluation-results';
import { Leaderboard } from './components/leaderboard/leaderboard';


export const routes: Routes = [

  // Auth
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },


  // Partie Admin
  {
    path: '',
    component: LayoutComponent,
    canActivate: [roleGuard],
    data: { roles: ['ROLE_ADMIN'] },

    children: [

      {
        path: 'dashboard',
        component: AdminDashboardComponent
      },

      {
        path: 'user',
        component: UserComponent
      },

      {
        path: 'team',
        component: TeamComponent
      },

      {
        path: 'project',
        component: ProjectComponent
      }

    ]
  },


  // Partie Participant

  {
    path: 'participant/dashboard',
    component: ParticipantDashboardComponent,
    canActivate: [authGuard]
  },


  {
    path: 'participant/join-team',
    component: JoinTeam,
    canActivate: [authGuard]
  },

  {
    path: 'jury',
    component: JuryDashboard,
    canActivate: [roleGuard],
    data: { roles: ['ROLE_JURY'] }
  },
  {
    path: 'jury/evaluate/:id',
    component: EvaluationForm,
    canActivate: [roleGuard],
    data: { roles: ['ROLE_JURY'] }
  },
  {
    path: 'jury/results',
    component: EvaluationResults,
    canActivate: [roleGuard],
    data: { roles: ['ROLE_JURY'] }
  },

  {
    path: 'leaderboard',
    component: Leaderboard,
    canActivate: [authGuard]
  },


  {
    path: 'participant/my-team',
    loadComponent: () =>
      import('./participant/my-team/my-team')
        .then(m => m.MyTeam),
    canActivate: [authGuard]
  },


  // Route inconnue toujours en dernier
  {
    path: '**',
    redirectTo: 'login'
  }



];
