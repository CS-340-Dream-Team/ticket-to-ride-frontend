import { Injectable } from '@angular/core';
import { Game } from '../../types/game/game.type';
import { ServerProxyService } from '../server-proxy/server-proxy.service';
import { Command, Route, Segment, Location as MapLocation, Player, BusCard } from '../../types';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import TurnState, {
  GameInitState,
  GameOverState,
  NotYourTurnState,
  YourTurnState
} from './states';


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
  private _playerTurn: string;
  private _playerTurnSubject = new Subject<string>();

  private lastCommandId = -1;
  polling = false;

  // Game play data
  private _clientPlayer: Player;
  private _allPlayers: Player[];
  private _clientPlayerSubject = new Subject<Player>();
  private _opponentPlayers: Player[];
  private _allPlayersSubject = new Subject<Player[]>();
  private _spreadSubject = new Subject<BusCard[]>();
  private _deckSizeSubject = new Subject<number>();
  private _routeDeckSize = 20;
  private _routeDeckSizeSubject = new Subject<number>();

  private _turnState: TurnState = new GameInitState();

  public setState(newState: 'init' | 'gameover' | 'yourturn' | 'notyourturn') {
    switch (newState) {
      case 'init':
        this._turnState = new GameInitState();
        break;
      case 'gameover':
        this._turnState = new GameOverState();
        break;
      case 'yourturn':
        this._turnState = new YourTurnState();
        break;
      case 'notyourturn':
        this._turnState = new NotYourTurnState();
        break;
      default:
        console.warn('Unrecognized state: not switching');
    }
  }

  constructor(private serverProxy: ServerProxyService, private toastr: ToastrService) {
    this._routeDeckSizeSubject.next(this._routeDeckSize);
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

  get allPlayersSubject() {
    return this._allPlayersSubject;
  }

  get currentGameSubject() {
    return this._currentGameSubject;
  }

  get locationSubject(): Subject<MapLocation[]> {
    return this._locationSubject;
  }

  get segmentSubject(): Subject<Segment[]> {
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

  get playerTurnSubject() {
    return this._playerTurnSubject;
  }

  get allPlayers() {
    return this._allPlayers;
  }
  
  get routeDeckSizeSubject(): Subject<number> {
    return this._routeDeckSizeSubject;
  }

  incrementplayerTurn(currentTurnName: string) {
    this._playerTurn = currentTurnName;
    this._playerTurnSubject.next(this._playerTurn);
    if (currentTurnName === this.clientPlayer.name) {
      this.setState("yourturn");
    }
    if (this._turnState instanceof YourTurnState) {
      this.setState("notyourturn");
    }
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
      if (command.type === 'updateSpread') {
        const spread = command.data.spread;
        const deckSize = command.data.deckSize;
        this._spreadSubject.next(spread);
        this._deckSizeSubject.next(deckSize);
      } else if (command.type === 'updatePlayers') {
        const players = command.data.players;
        this._allPlayers = players;
        this._allPlayersSubject.next(players);
        this._selectingRoutes = true;
        this._selectingRoutesSubject.next(this._selectingRoutes);
      } else if (command.type === 'incrementTurn') {
        let name = command.data['playerTurnName'];
        console.log(name);
        this.incrementplayerTurn(name);
      }
      else if (command.type === 'drawRoutes') {
        if (command.player === this.clientPlayer.name) {
          this._selectingRoutes = true;
          this._selectingRoutesSubject.next(this._selectingRoutes);
        }
        else {
          //FIXME: update number of routes for other players.
        }
      } else if (command.type === 'discardRoutes') {

        //FIXME:add routes to player.
      }
    });
  }

  setSegmentOwner(index: number, player: Player) {
    console.log(JSON.stringify(this._segments[index]));
    this._segments[index].owner = player;
    this.segmentSubject.next(this._segments);
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
    // Example of using state:
    this._turnState.drawBusCard(this);
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
    this.serverProxy.claimSegment(segment)
      .then((commands: Command[]) => this.handleCommands(commands));
  }
}
