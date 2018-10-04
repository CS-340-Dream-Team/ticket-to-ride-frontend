import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { GameListComponent, LoginScreenComponent } from './pages';
import { CreateGameDialogComponent } from './pages/game-list/create-game-dialog/create-game-dialog.component';
import { ListedGameComponent } from './pages/game-list/listed-game/listed-game.component';

import {
  AuthManagerService,
  GameListManagerService,
  ServerProxyService
} from './services';

const appRoutes: Routes = [
  { path: 'login', component: LoginScreenComponent },
  { path: 'game-list', component: GameListComponent },
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
    ListedGameComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [
    AuthManagerService,
    GameListManagerService,
    ServerProxyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
