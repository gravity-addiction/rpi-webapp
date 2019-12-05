import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthenticationInterceptor } from 'modules/login/app/authentication.interceptor';
import { AuthGuardLoggedIn } from 'modules/login/app/_guards/auth-guard-logged-in';
import { AuthGuardLoggedOut } from 'modules/login/app/_guards/auth-guard-logged-out';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    AuthGuardLoggedIn,
    AuthGuardLoggedOut,
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
  ]
})

export class LoginModule {}
