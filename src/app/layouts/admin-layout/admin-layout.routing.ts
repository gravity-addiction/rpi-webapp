import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { ProcessesComponent } from '../../processes/processes.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'processes',     component: ProcessesComponent },
    { path: 'notifications',  component: NotificationsComponent }
];
