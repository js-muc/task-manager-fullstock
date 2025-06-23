import { Routes } from '@angular/router';
import { SignalTaskListComponent } from './features/signals/signal-task-list.component';
import { LegacyTaskListComponent } from './features/legacy/legacy-task-list.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';

export const appRoutes: Routes = [
  { path: 'signals', component: SignalTaskListComponent },
  { path: 'legacy', component: LegacyTaskListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'signals', pathMatch: 'full' },
  { path: '**', redirectTo: 'signals' }
];
