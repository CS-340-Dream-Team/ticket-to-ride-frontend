import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { GamePlayManagerService } from '../../services';
import { Segment } from 'src/app/types';
import { ClaimSegmentComponent } from '../game-play/claim-segment/claim-segment.component';

@Component({
  selector: 'app-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.scss']
})
export class GameScreenComponent implements OnInit {
  public selectingRoutes: Boolean = false;
  public gameOver: Boolean = false;
  public segmentBeingClaimed: Boolean = false;

  @ViewChild(ClaimSegmentComponent) segmentClaimModal: ClaimSegmentComponent;

  constructor(private gamePlayManager: GamePlayManagerService) {
    gamePlayManager.selectingRoutesSubject.subscribe({
      next: (selectingRoutes) => {
        this.selectingRoutes = selectingRoutes;
      }
    });
    gamePlayManager.gameOverStatsSubject.subscribe({
      next: (stats) => this.gameOver = stats.length > 0
    });
    this.gamePlayManager.segmentBeingClaimedSubject.subscribe({
      next: (s) => {
        this.segmentClaimModal.display(s, gamePlayManager.clientPlayer);
      }
    });
  }

  ngOnInit() {
  }

}
