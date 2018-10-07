import { Injectable } from '@angular/core';
import { Game } from '../../types/game/game.type';
import { ServerProxyService } from '../server-proxy/server-proxy.service';
import { Command } from '../../types';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameListManagerService {
  constructor(private serverProxy: ServerProxyService) {
    if (!this.polling) {
      this.polling = true;
      this.poll(serverProxy);
    }
  }

  get gamesSubject() {
    return this._gamesSubject;
  }

  get activeGameSubject() {
    return this._activeGameSubject;
  }

  _gamesSubject = new Subject<Game[]>();
  _activeGameSubject = new Subject<Game|null>();
  games: Game[] = [];
  activeGame: Game|null = null;
  polling = false;

  private poll(serverProxy: ServerProxyService) {
    if (!this.polling) {
      return;
    }
    serverProxy.getUpdatedGames().then(commands => {
      this.handleCommands(commands);
    });
    setTimeout(() => {
      this.poll(serverProxy);
    }, 3000);
  }

  private handleCommands(commands: Command[]) {
    commands.forEach(command => {
      if (command.type === 'updateGameList') {
        this.games = command.data.gameList;
        this._gamesSubject.next(this.games);
      }
    });
  }

  setActiveGame(game: Game|null) {
    this.activeGame = game;
    this._activeGameSubject.next(this.activeGame);
  }

  createGame(gameName: string) {
    this.serverProxy.createGame(gameName).then(commands => {
      this.handleCommands(commands);
    });
  }

  joinGame(game: Game) {
    this.serverProxy.joinGame(game).then(commands => {
      this.handleCommands(commands);
    });
  }
}
