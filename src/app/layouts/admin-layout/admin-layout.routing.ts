import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { ProcessesComponent } from '../../processes/processes.component';
import { SystemInfoComponent } from 'app/system-info/system-info.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'processes',     component: ProcessesComponent },
    { path: 'sysinfo',     component: SystemInfoComponent },
    { path: 'notifications',  component: NotificationsComponent }
];
