import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../../../types';
import { GameListManagerService } from '../../../services';

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