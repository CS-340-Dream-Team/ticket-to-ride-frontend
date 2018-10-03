import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameListComponent } from './game-list/game-list.component';
import { CreateGameDialogComponent } from './create-game-dialog/create-game-dialog.component';


import {
  AuthManagerService,
  GameListManagerService,
  ServerProxyService
} from './services';
import { ListedGameComponent } from './listed-game/listed-game.component';

import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    AppComponent,
    GameListComponent,
    CreateGameDialogComponent,
    ListedGameComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [
    AuthManagerService,
    GameListManagerService,
    ServerProxyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
