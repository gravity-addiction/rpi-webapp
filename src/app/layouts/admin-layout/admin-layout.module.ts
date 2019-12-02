import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { ProcessesComponent } from '../../processes/processes.component';

import { ByteconvertModule } from '../../_pipes/byteconvert.pipe';
import { KeyvalueModule } from '../../_pipes/keyvalue.pipe';

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule
} from '@angular/material';
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
    ProcessesComponent
  ]
})

export class AdminLayoutModule {}
