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
  _currentGameSubject = new Subject<Game | null>();
  _gameStartedSubject = new Subject<boolean>();
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
      const activeID = this.currentGame === null ? -1 : this.currentGame.id;
      if (command.type === "updateGameList") {
        this.games = command.data.gameList;
        this._gamesSubject.next(this.games);
      } else if (command.type === "updatePlayerList") {
        this.currentGame.playersJoined = command.data.playerList;
        this.currentGame.numPlayers = command.data.playerList.length;
      } else if (command.type === "gameStarted") {
        this._gameStartedSubject.next(true);
        this.findClientPlayer(command);
        this.gameplayService.startGame();
        this.chatService.poll(this.serverProxy);
        this.polling = false;
      }
      this.games.forEach(game => {
        if (game.id === activeID && game !== this.currentGame) {
          this.currentGame = game;
          this._currentGameSubject.next(this.currentGame);
        }
      });
    });
  }

  findClientPlayer(command: Command) {
    command.data.game.playersJoined.forEach(player => {
      if (player.name === this.authService.currentUser.name) {
        this.gameplayService.clientPlayer = player;
        this.gameplayService.clientPlayerSubject.next(player);
      }
    })
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
    });;
  }

  // TODO: Move this to the game running service
  startGame(game: Game) {
    console.warn(
      "Remember to move this logic into the same service that handles game logic"
    );
    this.serverProxy.startGame(game).then(commands => {
      this.handleCommands(commands);
    })
  }
}
