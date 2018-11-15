import { Injectable } from '@angular/core';
import { Game } from '../../types/game/game.type';
import { ServerProxyService } from '../server-proxy/server-proxy.service';
import { Command } from '../../types';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { GamePlayManagerService } from '../game-play-manager/game-play-manager.service';
import { AuthManagerService } from '../auth-manager/auth-manager.service';
import { ChatManagerService } from '../chat-manager/chat-manager.service';


@Injectable({
  providedIn: "root"
})
export class GameListManagerService {
  constructor(
    private serverProxy: ServerProxyService,
    private toastr: ToastrService,
    private gameplayService: GamePlayManagerService,
    private chatService: ChatManagerService,
    private authService: AuthManagerService) {
    if (!this.polling) {
      this.startPolling();
    }
  }

  get gamesSubject() {
    return this._gamesSubject;
  }

  get currentGameSubject() {
    return this._currentGameSubject;
  }

  _gamesSubject = new Subject<Game[]>();
  _currentGameSubject = new Subject<Game | null>();
  _gameStartedSubject = new Subject<boolean>();
  games: Game[] = [];
  currentGame: Game = null;
  polling = false;
  private _pollingTimer: any;

  public startPolling(pollingInterval: number = 3000) {
    this.polling = true;
    this._pollingTimer = setInterval(() => {
      this.poll(this.serverProxy);
    }, pollingInterval);
  }

  private poll(serverProxy: ServerProxyService) {
    if (!this.polling) {
      return;
    }
    serverProxy.getUpdatedGames().then(commands => {
      this.handleCommands(commands);
    }).catch(res => {
      this.toastr.error(res.message);
      console.error('Stopped polling gamesList due to error. Refresh to try again.');
      this.stopPolling();
    });
  }

  public stopPolling() {
    this.polling = false;
    clearInterval(this._pollingTimer);
    this._pollingTimer = false;
  }

  private handleCommands(commands: Command[]) {
    commands.forEach(command => {
      const activeID = this.currentGame === null ? -1 : this.currentGame.id;
      if (command.type === "updateGameList") {
        this.games = command.data.gameList;
        this._gamesSubject.next(this.games);
      } else if (command.type === "updatePlayerList") {
        this.currentGame.playersJoined = command.data.playerList;
        this.currentGame.numPlayers = command.data.playerList.length;
      } else if (command.type === "gameStarted") {
        this._gameStartedSubject.next(true);
        this.gameplayService.startGame();
        this.chatService.startPolling();
        this.stopPolling();
      }
      this.games.forEach(game => {
        if (game.id === activeID && game !== this.currentGame) {
          this.currentGame = game;
          this._currentGameSubject.next(this.currentGame);
        }
      });
    });
  }

  setCurrentGame(game: Game | null) {
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
    });
  }

  startGame(game: Game) {
    this.toastr.info(`Started Game '${game.name}' with ${game.numPlayers}`);
    this.serverProxy.startGame(game).then(commands => {
      this.handleCommands(commands);
    })
  }
}
