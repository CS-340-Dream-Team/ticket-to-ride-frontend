import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../types/game/Game';
import { GameListManagerService } from '../services/game-list-manager/game-list-manager.service';

@Component({
  selector: 'app-listed-game',
  templateUrl: './listed-game.component.html',
  styleUrls: ['./listed-game.component.css']
})
export class ListedGameComponent implements OnInit {

  @Input() game: Game;

  constructor(private gameListManager: GameListManagerService) { }

  ngOnInit() {
  }

  getRemaining() {
    return 5 - this.game.numPlayers;
  }

  joinGame() {
    this.gameListManager.joinGame(this.game);
  }

}
