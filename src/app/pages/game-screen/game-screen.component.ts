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
      }
    });
    gamePlayManager.gameOverStatsSubject.subscribe({
      next: (stats) => this.gameOver = stats.length > 0
    })
  }

  public selectingRoutes = false;
  public gameOver = false;

  ngOnInit() {
  }

}
