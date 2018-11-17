import { Component, OnInit } from '@angular/core';
import { GameOverStat } from 'src/app/types/game-over-stat/GameOverStat';
import { GamePlayManagerService } from 'src/app/services';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss']
})
export class GameOverComponent implements OnInit {
  private _stats: GameOverStat[] = [];
  constructor(private gamePlayManagerService: GamePlayManagerService) {

    gamePlayManagerService.gameOverStatsSubject.subscribe({
      next: (stats) => this._stats = stats
    })
  }

  ngOnInit() {
  }

}
