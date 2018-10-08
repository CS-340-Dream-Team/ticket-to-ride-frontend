import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../../types';
import { GameListManagerService } from '../../services';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit {

  @Input() activeGames: Game[] = [];
  selectedGame: Game|null = null;

  constructor(private gameListManager: GameListManagerService) {
    gameListManager.gamesSubject.subscribe({
      next: (games) => this.activeGames = games
    });
    gameListManager.currentGameSubject.subscribe({
      next: (game) => this.selectedGame = game
    });
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

  canSelectGame(): boolean {
    return this.selectedGame == null;
  }

  select(game: Game) {
    this.gameListManager.setCurrentGame(game);
  }

  deselectGame() {
    this.select(null);
  }
}

// tslint:disable-next-line:max-line-length
// FIXME Give photographer cred. By Creator: Javin Weaver [CC BY-SA 3.0  (https://creativecommons.org/licenses/by-sa/3.0) or GFDL (http://www.gnu.org/copyleft/fdl.html)], from Wikimedia Commons
