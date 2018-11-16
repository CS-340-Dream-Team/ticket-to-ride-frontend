import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { NgxAutoScrollModule } from "ngx-auto-scroll";

import { AppComponent } from './app.component';
import {
  ChatComponent,
  GameListComponent,
  GameScreenComponent,
  LoginScreenComponent,
  MapComponent
} from './pages';

import { CreateGameDialogComponent } from './pages/game-list/create-game-dialog/create-game-dialog.component';
import { ListedGameComponent } from './pages/game-list/listed-game/listed-game.component';
import { LobbyComponent } from './pages/game-list/lobby/lobby.component';
import { MessageComponent } from './pages/chat/message/message.component';
import { PlayerBarComponent } from './pages/game-screen/player-bar/player-bar.component';
import { RouteSelectorComponent } from './pages/game-play/route-selector/route-selector.component';
import { DeckBarComponent } from './pages/game-screen/deck-bar/deck-bar.component';

import {
  AuthGuardService,
  AuthManagerService,
  GameListManagerService,
  GamePlayManagerService,
  ServerProxyService
} from './services';
import { GameOverComponent } from './pages/game-play/game-over/game-over.component';


const appRoutes: Routes = [
  { path: 'login', component: LoginScreenComponent },
  {
    path: 'game-list',
    component: GameListComponent,
    // canActivate: [AuthGuardService]
  },
  {
    path: 'game-play',
    component: GameScreenComponent,
    // canActivate: [AuthGuardService]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginScreenComponent,
    GameListComponent,
    CreateGameDialogComponent,
    ListedGameComponent,
    LobbyComponent,
    ChatComponent,
    MessageComponent,
    GameScreenComponent,
    MapComponent,
    PlayerBarComponent,
    RouteSelectorComponent,
    RouteSelectorComponent,
    DeckBarComponent,
    GameOverComponent
  ],
  imports: [
    BrowserAnimationsModule, // required animations module
    BrowserModule,
    FormsModule,
    ToastrModule.forRoot(),
    HttpModule,
    NgxAutoScrollModule,
    RouterModule.forRoot(
      appRoutes,
      { useHash: true }
    )
  ],
  providers: [
    AuthGuardService,
    AuthManagerService,
    GameListManagerService,
    GamePlayManagerService,
    ServerProxyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
