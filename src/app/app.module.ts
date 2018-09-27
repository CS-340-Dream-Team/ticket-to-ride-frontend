import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';


import {
  AuthManagerService,
  CommandManagerService,
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
    CommandManagerService,
    ServerProxyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
