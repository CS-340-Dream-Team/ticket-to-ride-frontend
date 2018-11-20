import { Component, OnInit } from '@angular/core';
import { GamePlayManagerService } from '../../services';
import { Segment } from 'src/app/types';

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
    });
    gamePlayManager.segmentBeingClaimedSubject.subscribe({
      next: (s) => this.segmentBeingClaimed = Boolean(s)
    })

  }

  public selectingRoutes: Boolean = false;
  public gameOver: Boolean = false;
  public segmentBeingClaimed: Boolean = false;

  ngOnInit() {
  }

}
