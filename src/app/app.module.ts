import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';


import {
  AuthManagerService,
  ServerProxyService
} from './services';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    AuthManagerService,
    ServerProxyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
