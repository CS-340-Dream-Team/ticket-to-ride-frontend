import { TestBed, async } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { AppComponent } from './app.component';
import { GameListComponent } from './pages';
<<<<<<< HEAD
import { ListedGameComponent } from './pages/game-list/listed-game/listed-game.component';
import { CreateGameDialogComponent } from './pages/game-list/create-game-dialog/create-game-dialog.component';
import { LoginScreenComponent } from './pages';

import { RouterModule, Routes } from '@angular/router';

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
=======
import { CreateGameDialogComponent } from './pages/game-list/create-game-dialog/create-game-dialog.component';
>>>>>>> Restructuring + Routing

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        CreateGameDialogComponent,
        GameListComponent,
        ListedGameComponent,
        LoginScreenComponent
      ],
      imports: [
        RouterModule.forRoot(
          appRoutes,
          { enableTracing: true } // <-- debugging purposes only
        )
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
