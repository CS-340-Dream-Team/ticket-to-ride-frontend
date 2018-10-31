import { Component, OnInit } from '@angular/core';
import { Player, PlayerColor } from 'src/app/types';
import { GamePlayManagerService } from 'src/app/services';

@Component({
  selector: 'app-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss']
})
export class PlayerBarComponent implements OnInit {

  public playerColor = PlayerColor;

  public players: Player[] = [];

  constructor(
    private gamePlayManager: GamePlayManagerService
  ) {
    this.gamePlayManager.allPlayersSubject.subscribe({
      next: players => {
        this.players = players;
      }
    });
  }

  ngOnInit() {
  }

  public isCurrentPlayer(player) {
    return player.name === this.gamePlayManager.clientPlayer.name;
  }

}
