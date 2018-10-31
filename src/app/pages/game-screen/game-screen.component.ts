import { Component, OnInit } from '@angular/core';
import { GamePlayManagerService } from '../../services';

@Component({
  selector: 'app-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.scss']
})
export class GameScreenComponent implements OnInit {

  constructor(private gamePlayManager: GamePlayManagerService) {
    gamePlayManager.selectingRoutesSubject.subscribe({
      next: (selectingRoutes) => {
        this.selectingRoutes = selectingRoutes;
        console.log('Updating selectingRoutes to ' + (selectingRoutes));
      }
    });
  }

  public selectingRoutes = true;

  ngOnInit() {
  }

}
