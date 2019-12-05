import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatRippleModule, MatFormFieldModule, MatTooltipModule, MatSelectModule } from '@angular/material';

import { ProcessesComponent } from 'modules/sysinfo/app/processes/processes.component';
import { SystemInfoComponent } from 'modules/sysinfo/app/system-info/system-info.component';

import { ByteconvertModule } from 'app/_pipes/byteconvert.pipe';

export const routes: Routes = [
  { path: 'processes', component: ProcessesComponent },
  { path: 'sysinfo', component: SystemInfoComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,

    ByteconvertModule
  ],
  declarations: [
    ProcessesComponent,
    SystemInfoComponent
  ]
})

export class SysinfoModule {}
