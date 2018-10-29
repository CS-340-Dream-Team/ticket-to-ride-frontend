import { Injectable } from '@angular/core';
import { Game } from '../../types/game/game.type';
import { ServerProxyService } from '../server-proxy/server-proxy.service';
import { Command, Route, Segment, Location as MapLocation, Player } from '../../types';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class GamePlayManagerService {

  private _clientPlayer: Player;

  constructor(private serverProxy: ServerProxyService, private toastr: ToastrService) {
    if (!this.polling) {
      this.polling = true;
      this.poll(serverProxy);
    }
  }

  get clientPlayer() {
    return this._clientPlayer;
  }

  set clientPlayer(player: Player) {
    this._clientPlayer = player;
  }

  get currentGameSubject() {
    return this._currentGameSubject;
  }

  get locationSubject() : Subject<MapLocation[]> {
    return this._locationSubject;
  }

  get segmentSubject() : Subject<Segment[]> {
    return this._segmentSubject;
  }

  get selectingRoutesSubject(): Subject<boolean> {
    return this._selectingRoutesSubject;
  }

  _currentGameSubject = new Subject<Game | null>();
  private _locations: MapLocation[] = [];
  private _locationSubject = new Subject<MapLocation[]>();
  private _segments: Array<Segment> = [];
  private _segmentSubject = new Subject<Segment[]>();
  currentGame: Game = null;
  polling = false;
  private _selectingRoutes = false;
  private _selectingRoutesSubject = new Subject<boolean>();

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

  public startGame() {
    console.log('Starting the game!');
    this._selectingRoutes = true;
    this._selectingRoutesSubject.next(this._selectingRoutes);
  }

  public getMapData() {
    this.serverProxy.getMapData()
    .then(({ locations, segments }: { locations: MapLocation[], segments: Segment[] }) => {
      this._locations = locations;
      this._segments = segments;
      this.locationSubject.next(this._locations);
      this.segmentSubject.next(this._segments);
    });
  }

  public selectBusCard(index: number) {
    // FIXME implement
  }

  public selectRoutes(selectedRoutes: Route[], rejectedRoutes: Route[]) {
    this.serverProxy.selectRoutes(selectedRoutes, rejectedRoutes);
    // FIXME, wait until a successful response
    this._selectingRoutes = false;
    this.selectingRoutesSubject.next(this._selectingRoutes);
  }

  public claimSegment(segment: Segment): void {
    console.log(`Attempt to claim segment between ${segment.start.name} and ${segment.end.name}`);
    // check if it is the player's turn.
    // check if they have all the right bus pieces.
    this.serverProxy.claimSegment(segment)
      .then((commands: Command[]) => this.handleCommands(commands));
  }
}
