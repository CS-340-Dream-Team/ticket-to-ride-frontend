import { Injectable } from '@angular/core';
import { Game } from '../../types/game/game.type';
import { ServerProxyService } from '../server-proxy/server-proxy.service';
import { Command } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class GameListManagerService {
  constructor(private serverProxy: ServerProxyService) {
    if (!GameListManagerService.polling) {
      GameListManagerService.polling = true;
      GameListManagerService.poll(serverProxy);
    }
  }

  static games: Game[] = [];
  static polling = false;

  private static poll(serverProxy: ServerProxyService) {
    if (!GameListManagerService.polling) {
      return;
    }
    serverProxy.getUpdatedGames().then(commands => {
      GameListManagerService.handleCommands(commands);
    });
    setTimeout(() => {
      GameListManagerService.poll(serverProxy);
    }, 3000);
  }

  private static handleCommands(commands: Command[]) {
    commands.forEach(command => {
      if (command.type === 'updateGameList') {
        this.games = command.data.gameList;
        // Update all subscribers here
      }
    });
  }

  createGame(gameName: string) {
    this.serverProxy.createGame(gameName).then(commands => {
      GameListManagerService.handleCommands(commands);
    });
  }

  joinGame(game: Game) {
    this.serverProxy.joinGame(game).then(commands => {
      GameListManagerService.handleCommands(commands);
    });
  }
}
