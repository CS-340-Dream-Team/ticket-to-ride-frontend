import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { GameListComponent, LoginScreenComponent } from './pages';
import { CreateGameDialogComponent } from './pages/game-list/create-game-dialog/create-game-dialog.component';
import { ListedGameComponent } from './pages/game-list/listed-game/listed-game.component';

import {
  AuthGuardService,
  AuthManagerService,
  GameListManagerService,
  ServerProxyService
} from './services';
import { LobbyComponent } from './pages/game-list/lobby/lobby.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginScreenComponent },
  {
    path: 'game-list',
    component: GameListComponent,
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
    LobbyComponent
  ],
  imports: [
    BrowserAnimationsModule, // required animations module
    BrowserModule,
    ToastrModule.forRoot(),
    HttpModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [
    AuthGuardService,
    AuthManagerService,
    GameListManagerService,
    ServerProxyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
