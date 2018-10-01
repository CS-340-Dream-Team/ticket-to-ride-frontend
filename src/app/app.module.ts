import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';


import {
  AuthManagerService,
  CommandManagerService,
  ServerProxyService
} from './services';
import { LoginScreenComponent } from './login-screen/login-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginScreenComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    AuthManagerService,
    CommandManagerService,
    ServerProxyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
