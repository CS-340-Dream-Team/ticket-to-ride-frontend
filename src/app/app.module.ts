import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {
  ChatComponent,
  GameListComponent,
  GameScreenComponent,
  LoginScreenComponent,
} from './pages';

import { CreateGameDialogComponent } from './pages/game-list/create-game-dialog/create-game-dialog.component';
import { ListedGameComponent } from './pages/game-list/listed-game/listed-game.component';
import { LobbyComponent } from './pages/game-list/lobby/lobby.component';
import { MessageComponent } from './pages/chat/message/message.component';

import {
  AuthGuardService,
  AuthManagerService,
  GameListManagerService,
  GamePlayManagerService,
  ServerProxyService
} from './services';


const appRoutes: Routes = [
  { path: 'login', component: LoginScreenComponent },
  { path: 'chat', component: ChatComponent },
  {
    path: 'game-list',
    component: GameListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'game-play',
    component: GameScreenComponent,
    canActivate: [AuthGuardService]
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
    GameScreenComponent
  ],
  imports: [
    BrowserAnimationsModule, // required animations module
    BrowserModule,
    FormsModule,
    ToastrModule.forRoot(),
    HttpModule,
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
