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

  get currentGameSubject() {
    return this._currentGameSubject;
  }

  _gamesSubject = new Subject<Game[]>();
  _currentGameSubject = new Subject<Game|null>();
  games: Game[] = [];
  currentGame: Game = null;
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
      const activeID = this.currentGame === null ? -1 : this.currentGame.id;
      if (command.type === 'updateGameList') {
        this.games = command.data.gameList;
        this._gamesSubject.next(this.games);
      } else if (command.type === 'updatePlayerList') {
        this.currentGame.playersJoined = command.data.playerList;
        this.currentGame.numPlayers = command.data.playerList.length;
      }
      let found = false;
      this.games.forEach(game => {
        if (game.id === activeID && game !== this.currentGame) {
          found = true;
          this.currentGame = game;
          this._currentGameSubject.next(this.currentGame);
        }
      });
      if (!found) {
        this.currentGame = null;
        this._currentGameSubject.next(this.currentGame);
      }
    });
  }

  setCurrentGame(game: Game|null) {
    this.currentGame = game;
    this._currentGameSubject.next(this.currentGame);
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
