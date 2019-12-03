import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatRippleModule, MatFormFieldModule, MatTooltipModule, MatSelectModule } from '@angular/material';

// Layout
import { AdminLayoutRoutes } from './admin-layout.routing';

// Components
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { ProcessesComponent } from '../../processes/processes.component';
import { SystemInfoComponent } from '../../system-info/system-info.component';

// Pipes
import { ByteconvertModule } from '../../_pipes/byteconvert.pipe';
import { KeyvalueModule } from '../../_pipes/keyvalue.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,

    ByteconvertModule,
    KeyvalueModule
  ],
  declarations: [
    DashboardComponent,
    NotificationsComponent,
    ProcessesComponent,
    SystemInfoComponent
  ]
})

export class AdminLayoutModule {}
