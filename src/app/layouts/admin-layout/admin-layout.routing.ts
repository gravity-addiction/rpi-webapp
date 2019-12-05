import { Routes } from '@angular/router';

import { DashboardComponent } from 'app/dashboard/dashboard.component';
import { NotificationsComponent } from 'app/notifications/notifications.component';
import { SpotifyComponent } from 'modules/spotify/app/spotify.component';

export const AdminLayoutRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'spotify', component: SpotifyComponent },
  { path: 'notifications', component: NotificationsComponent }
];
