import { Injectable } from '@angular/core';
import { Game } from '../../types/game/game.type';
import { ServerProxyService } from '../server-proxy/server-proxy.service';
import { Command } from '../../types';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class GameListManagerService {
  constructor(private serverProxy: ServerProxyService, private toastr: ToastrService) {
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
    }).catch(res => {
      this.toastr.error(res.message);
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
      } else if (command.type === 'updatePlayerList') {
        this.currentGame.playersJoined = command.data.playerList;
        this.currentGame.numPlayers = command.data.playerList.length;
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
    }).catch(res => {
      this.toastr.error(res.message);
    });;
  }

  joinGame(game: Game) {
    this.serverProxy.joinGame(game).then(commands => {
      this.handleCommands(commands);
    }).catch(res => {
      this.toastr.error(res.message);
    });;
  }
}
