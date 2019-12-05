import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatRippleModule, MatFormFieldModule, MatTooltipModule, MatSelectModule } from '@angular/material';

// Components
import { SpotifyComponent } from 'modules/spotify/app/spotify.component';

// Pipes
import { KeyvalueModule } from 'app/_pipes/keyvalue.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,

    KeyvalueModule
  ],
  declarations: [
    SpotifyComponent
  ]
})

export class SpotifyModule {}
