import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER, InjectionToken } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatInputModule, MatRippleModule, MatFormFieldModule, MatSliderModule, MatTooltipModule, MatSelectModule } from '@angular/material';

import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

import { AppInterceptor } from './app.interceptor';

import { CacheService, CacheServiceFactory } from './_services/cache.service';

import { DEFAULT_TIMEOUT } from './app.interceptor';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,

    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatTooltipModule,
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent
  ],
  providers: [
    CookieService,
    [
      { provide: APP_INITIALIZER, useFactory: CacheServiceFactory, deps: [CacheService], multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
      { provide: DEFAULT_TIMEOUT, useValue: 30000 }
    ]   
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
