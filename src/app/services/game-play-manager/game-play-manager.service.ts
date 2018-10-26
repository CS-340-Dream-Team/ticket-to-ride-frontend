import { Injectable } from '@angular/core';
import { Game } from '../../types/game/game.type';
import { ServerProxyService } from '../server-proxy/server-proxy.service';
import { Command, Route, Segment } from '../../types';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class GamePlayManagerService {
  constructor(private serverProxy: ServerProxyService, private toastr: ToastrService) {
    if (!this.polling) {
      this.polling = true;
      this.poll(serverProxy);
    }
  }

  get currentGameSubject() {
    return this._currentGameSubject;
  }

  _currentGameSubject = new Subject<Game | null>();
  currentGame: Game = null;
  polling = false;

  private poll(serverProxy: ServerProxyService) {
    if (!this.polling) {
      return;
    }
    // FIXME poll for game updates
    setTimeout(() => {
      this.poll(serverProxy);
    }, 3000);
  }

  private handleCommands(commands: Command[]) {
      commands.forEach(command => {
          switch (command.type) {
              // FIXME add any commands here
              default:
                break;
          }
      });
  }

  public getMapData() {
    
  }

  public selectBusCard(index: number) {
    // FIXME implement
  }

  public selectRoutes(routes: Route[] ) {
    // FIXME implement
  }

  public claimSegment(segment: Segment) {
    // FIXME implement
  }
}
