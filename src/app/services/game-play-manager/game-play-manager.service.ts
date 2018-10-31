import { Injectable } from '@angular/core';
import { Game } from '../../types/game/game.type';
import { ServerProxyService } from '../server-proxy/server-proxy.service';
import { Command, Route, Segment, Location as MapLocation, Player, BusCard } from '../../types';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class GamePlayManagerService {

  currentGame: Game = null;
  _currentGameSubject = new Subject<Game | null>();
  private _locations: MapLocation[] = [];
  private _locationSubject = new Subject<MapLocation[]>();
  private _segments: Array<Segment> = [];
  private _segmentSubject = new Subject<Segment[]>();
  private _selectingRoutes = false;
  private _selectingRoutesSubject = new Subject<boolean>();
  
  private lastCommandId = -1;
  polling = false;
  
  //Gameplay data
  private _clientPlayer: Player;
  private _clientPlayerSubject = new Subject<Player>();
  private _opponentPlayers: Player[];
  private _spreadSubject = new Subject<BusCard[]>();
  private _deckSizeSubject = new Subject<number>();

  constructor(private serverProxy: ServerProxyService, private toastr: ToastrService) {
  }

  get clientPlayer() {
    return this._clientPlayer;
  }

  set clientPlayer(player: Player) {
    this._clientPlayer = player;
  }

  get clientPlayerSubject() {
    return this._clientPlayerSubject;
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

  get spreadSubject(): Subject<BusCard[]> {
    return this._spreadSubject;
  }

  get deckSizeSubject(): Subject<number> {
    return this._deckSizeSubject;
  }

  poll(serverProxy: ServerProxyService) {
    serverProxy.getGameData(this.lastCommandId).then(commands => {
      if (commands.length > 0) {
        this.lastCommandId = 0;
        this.handleCommands(commands);
      }
    }).catch(res => {
      this.toastr.error(res.message);
    });
    setTimeout(() => {
      this.poll(serverProxy);
    }, 3000);
  }

  private handleCommands(commands: Command[]) {
    commands.forEach(command => {
      // FIXME implement gameplay commands
      if (command.type === 'updateSpread') {
        const spread = command.data.spread;
        const deckSize = command.data.deckSize;
        this._spreadSubject.next(spread);
        this._deckSizeSubject.next(deckSize);
      } else if (command.type === 'updateClientPlayer') {
        const player = command.data.player;
        this._clientPlayer = player;
        this._selectingRoutes = true;
        this._selectingRoutesSubject.next(this._selectingRoutes);
      } else if (command.type === 'updateOpponentPlayers') {
        const players = command.data.players;
        this._opponentPlayers = players;
      }
    });
  }

  public startGame() {
    console.log('Starting the game!');
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

  public getSpread(): Promise<BusCard[]> {
    return this.serverProxy.getSpread().then(command => {
      if (command.data['deckSize']) {
        this.deckSizeSubject.next(command.data['deckSize']);
      }
      return command.data['spread'];
    });
  }

  public drawRoutes(): Promise<Route[]> {
    return this.serverProxy.drawRoutes().then(command => {
      return command['privateData'];
    });
  }

  public selectRoutes(selectedRoutes: Route[], rejectedRoutes: Route[]) {
    this.serverProxy.selectRoutes(selectedRoutes, rejectedRoutes).then(commands => {
      this._selectingRoutes = false;
      this.selectingRoutesSubject.next(this._selectingRoutes);
    });
  }

  public claimSegment(segment: Segment): void {
    console.log(`Attempt to claim segment between ${segment.start.name} and ${segment.end.name}`);
    // check if it is the player's turn.
    // check if they have all the right bus pieces.
    this.serverProxy.claimSegment(segment)
      .then((commands: Command[]) => this.handleCommands(commands));
  }
}
