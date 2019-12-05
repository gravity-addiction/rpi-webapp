import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatRippleModule, MatFormFieldModule, MatTooltipModule, MatSelectModule } from '@angular/material';

// Layout
import { AdminLayoutRoutes } from './admin-layout.routing';

// Components
import { DashboardComponent } from 'app/dashboard/dashboard.component';
import { NotificationsComponent } from 'app/notifications/notifications.component';

// Pipes
import { ByteconvertModule } from 'app/_pipes/byteconvert.pipe';
import { KeyvalueModule } from 'app/_pipes/keyvalue.pipe';

// Modules
import { LoginModule } from 'modules/login/app';
import { SpotifyModule } from 'modules/spotify/app';
import { SysinfoModule } from 'modules/sysinfo/app';

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
    KeyvalueModule,

    LoginModule,
    SpotifyModule,
    SysinfoModule
  ],
  declarations: [
    DashboardComponent,
    NotificationsComponent
  ]
})

export class AdminLayoutModule {}
