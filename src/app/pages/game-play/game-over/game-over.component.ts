import { Component, OnInit } from '@angular/core';
import { GameOverStat } from 'src/app/types/game-over-stat/GameOverStat';
import { GamePlayManagerService, GameListManagerService } from 'src/app/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss']
})
export class GameOverComponent implements OnInit {
  private _stats: GameOverStat[] = [];

  constructor(private gamePlayManagerService: GamePlayManagerService, private router: Router, private glms: GameListManagerService) {
    gamePlayManagerService.gameOverStatsSubject.subscribe({
      next: (stats) => this._stats = stats
    })
  }

  ngOnInit() {
  }

  private _exit(): void {
    this.router.navigate(['/game-list']);
    this.glms.setCurrentGame(null);
  }
}
