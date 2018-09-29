import { Injectable } from '@angular/core';
import { Game } from '../../types/game/Game';
import { ServerProxyService } from '../server-proxy/server-proxy.service';

@Injectable({
  providedIn: 'root'
})
export class GameListManagerService {
  constructor(private serverProxy: ServerProxyService) { }

  createGame(gameName: string) {
    return this.serverProxy.createGame(gameName);
  }

  joinGame(game: Game) {
    return this.serverProxy.joinGame(game);
  }
}
