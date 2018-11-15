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
import { AuthManagerService } from '../auth-manager/auth-manager.service';


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
  private polling = false;
  private pollingTimer: any = null;


  // Game play data
  private _clientPlayer: Player;
  private _allPlayers: Player[];
  private _clientPlayerSubject = new Subject<Player>();
  private _opponentPlayers: Player[];
  private _allPlayersSubject = new Subject<Player[]>();
  private _spreadSubject = new Subject<BusCard[]>();
  private _deckSizeSubject = new Subject<number>();
  private _routeDeckSize = 28;
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

  constructor(
    private serverProxy: ServerProxyService,
    private toastr: ToastrService,
    private authService: AuthManagerService) {
    this._routeDeckSizeSubject.next(this._routeDeckSize);
    this.poll(this.serverProxy);
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
    if (this.polling) {
      serverProxy.getGameData(this.lastCommandId).then(commands => {
        if (commands.length > 0) {
          this.lastCommandId = 0;
          this.handleCommands(commands);
        }
      }).catch(res => {
        this.toastr.error(res.message);
      });
    }
    setTimeout(() => {
      this.poll(serverProxy);
    }, 2000);
  }

  private handleCommands(commands: Command[]) {
    commands.forEach(command => {
      switch (command.type) {
        case 'updateSpread':
          const spread = command.data.spread;
          const deckSize = command.data.deckSize;
          this._spreadSubject.next(spread);
          this._deckSizeSubject.next(deckSize);
          break;
        case 'updatePlayers':
          const players = command.data.players;
          this._allPlayers = players;
          this.findClientPlayer();
          this._allPlayersSubject.next(players);
          break;
        case 'incrementTurn':
          if (this.updateLastCommandID(command.id)) {
            let name = command.data['playerTurnName'];
            this.incrementplayerTurn(name);
          }
          break;
        case 'drawRoutes':
          if (this.updateLastCommandID(command.id)) {
            if (command.player===this.clientPlayer.name) {
              this.clientPlayer.routeCardBuffer = command.privateData;
              this._selectingRoutes = true;
              this._selectingRoutesSubject.next(this._selectingRoutes);
            } else {

            }
          }
          break;
        case 'discardRoutes':
          if (this.updateLastCommandID(command.id)) {
            if (command.player === this.clientPlayer.name) {
              this._selectingRoutes = false;
              this.selectingRoutesSubject.next(this._selectingRoutes);
              this._allPlayers.forEach((player, index) => {
                if (player.name === command.player) {
                  this._allPlayers[index].routeCards = (this._allPlayers[index].routeCards as Route[]).concat(command.privateData['cardsKept']);
                  this.allPlayersSubject.next(this._allPlayers);
                }
              });
            } else {
              this._allPlayers.forEach((player, index) => {
                if (player.name === command.player) {
                  this._allPlayers[index].routeCards += command.data['numCardsKept'];
                  this.allPlayersSubject.next(this._allPlayers);
                }
              });
            }
          }
          // FIXME:add routes to player.
          break;
        case 'endGame':
          this._endGame(command.data.players);
        break;
        default:
          break;
      }
    });
  }
  // if true then update data else don't
  private updateLastCommandID(commandID:number): boolean {
    if(commandID > this.lastCommandId){
      this.lastCommandId=commandID;
      return true;
    }
      return false;
  }
  setSegmentOwner(index: number, player: Player) {
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

  public getFullGame() {
    if (!this.authService.currentUser) {
      return this.serverProxy.getFullGame().then(command => {
        let data = command.data;
        this._clientPlayer = data.clientPlayer;
        this._clientPlayerSubject.next(data.clientPlayer);
        this._allPlayers = data.players;
        this._allPlayersSubject.next(data.players);
        this._deckSizeSubject.next(data.busDeckSize);
        this._routeDeckSize = data.routeDeckSize;
        this._routeDeckSizeSubject.next(data.routeDeckSize);
        this._spreadSubject.next(data.spread);
        this.incrementplayerTurn(data.turn);
        this.lastCommandId = command.data.id;
      });
    }
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

  private findClientPlayer() {
    this._allPlayers.forEach(player => {
      if (player.name === this.authService.currentUser.name) {
        this._clientPlayer = player;
        this.clientPlayerSubject.next(player);
      }
    });
  }

  private _endGame(players: Player[]): void {
    this.polling = false;
    this.setState('gameover');
    console.log('GAME OVER', players);
  }
}
