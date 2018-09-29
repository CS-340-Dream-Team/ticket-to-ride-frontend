import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../types/game/Game';
import { Player } from '../types/player/Player';
import { GameListManagerService } from '../services/game-list-manager/game-list-manager.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit {

  @Input() activeGames: Game[];

  constructor(private gameListManager: GameListManagerService) {
    // FIXME This is dummy data and should be removed once polling works.
    const player1 = new Player('Test Player 1');
    const player2 = new Player('Test Player 2');
    const game1 = new Game(player1, 'Test Game 1');
    game1.addPlayer(player2);
    const game2 = new Game(player2, 'Test Game 2');
    game2.addPlayer(player1);

    this.activeGames = [game1, game2];

  }

  createGameMenuOpen = false;

  ngOnInit() {
  }

  openCreateGameDialog() {
    this.createGameMenuOpen = true;
  }

  newGameTitle(name: string) {
    this.createGameMenuOpen = false;
    this.gameListManager.createGame(name);
  }

  closeDialog(e: Event) {
    this.createGameMenuOpen = false;
  }

  gameListEmpty(): boolean {
    return (this.activeGames.length === 0);
  }

}


// tslint:disable-next-line:max-line-length
// FIXME Give photographer cred. By Creator: Javin Weaver [CC BY-SA 3.0  (https://creativecommons.org/licenses/by-sa/3.0) or GFDL (http://www.gnu.org/copyleft/fdl.html)], from Wikimedia Commons
