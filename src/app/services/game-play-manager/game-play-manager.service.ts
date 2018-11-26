import { Injectable } from '@angular/core';
import { ServerProxyService } from '../server-proxy/server-proxy.service';
import { Command, Route, Segment, Location as MapLocation, Player, BusCard, BusColor } from '../../types';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import TurnState, {
  GameInitState,
  GameOverState,
  NotYourTurnState,
  YourTurnState
} from './states';
import { AuthManagerService } from '../auth-manager/auth-manager.service';
import { GameOverStat } from 'src/app/types/game-over-stat/GameOverStat';
import { HistoryManagerService } from '../history-manager/history-manager.service';


const busColorStringToEnumMap: Object = {
  any: BusColor.Rainbow,
  red: BusColor.Red,
  orange: BusColor.Orange,
  yellow: BusColor.Yellow,
  green: BusColor.Green,
  blue: BusColor.Blue,
  purple: BusColor.Purple,
  black: BusColor.Black,
  white: BusColor.White
}
@Injectable({
  providedIn: 'root'
})
export class GamePlayManagerService {

  private _gameOverStats: GameOverStat[] = [];
  private _gameOverStatsSubject: Subject<GameOverStat[]> = new Subject<GameOverStat[]>();
  private _locations: MapLocation[] = [];
  private _locationSubject = new Subject<MapLocation[]>();
  private _segments: Array<Segment> = [];
  private _segmentSubject = new Subject<Segment[]>();
  private _selectingRoutes = false;
  private _selectingRoutesSubject = new Subject<boolean>();
  private _playerTurn: string;
  private _playerTurnSubject = new Subject<string>();
  private _segmentBeingClaimedSubject: Subject<Segment> = new Subject<Segment>();

  private _segmentBeingClaimed: Segment = null;
  private lastCommandId = -1;
  private polling = false;
  private pollingTimer: any = null;


  // Game play data
  private _clientPlayer: Player;
  private _allPlayers: Player[];
  private _clientPlayerSubject = new Subject<Player>();
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
    public serverProxy: ServerProxyService,
    public toastr: ToastrService,
    private historyService: HistoryManagerService) {
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

  get gameOverStatsSubject(): Subject<GameOverStat[]> {
    return this._gameOverStatsSubject;
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

  get playerTurn() {
    return this._playerTurn;
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

  get segmentBeingClaimedSubject(): Subject<Segment> {
    return this._segmentBeingClaimedSubject;
  }

  get segmentBeingClaimed(): Segment {
    return this._segmentBeingClaimed;
  }

  set segmentBeingClaimed(s: Segment) {
    this._segmentBeingClaimed = s;
    this._segmentBeingClaimedSubject.next(s);
  }

  public showInfoToast(msg: string) {
    this.toastr.info(msg);
  }

  incrementplayerTurn(currentTurnName: string) {
    this._playerTurn = currentTurnName;
    this._playerTurnSubject.next(this._playerTurn);
    if (currentTurnName === this.clientPlayer.name) {
      this.setState("yourturn");
    }
    else if (this._turnState instanceof YourTurnState) {
      this.setState("notyourturn");
    }
  }

  getMinRoutesNumber() {
    if (this._turnState instanceof YourTurnState) {
      return 1;
    } else if (this._turnState instanceof GameInitState) {
      return 2;
    }
    return 0;
  }

  startPolling(pollingInterval: number = 2000) {
    this.polling = true;
    this.pollingTimer = setInterval(() => {
      this.poll(this.serverProxy);
    }, pollingInterval);
  }

  poll(serverProxy: ServerProxyService) {
    if (!this.polling) {
      return;
    }
    serverProxy.getGameData(this.lastCommandId).then(commands => {
      if (commands.length > 0) {
        this.lastCommandId = 0;
        this.handleCommands(commands);
      }
    }).catch(res => {
      this.toastr.error(res.message);
      console.error('Stopped polling gameData due to error. Refresh to try again.');
      this.stopPolling();
    });
  }

  stopPolling(): void {
    this.polling = false;
    clearInterval(this.pollingTimer);
    this.pollingTimer = null;
  }

  public handleCommands(commands: Command[]) {
    commands.forEach(command => {
      switch (command.type) {
        case 'updateSpread':
          if (this.updateLastCommandID(command.id)) {
            const spread = command.data.spread;
            const deckSize = command.data.deckSize;
            this._spreadSubject.next(spread);
            this._deckSizeSubject.next(deckSize);
          }
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
            }
          }
          break;
        case 'drawBusCard':
          if (this.updateLastCommandID(command.id)) {
            this._allPlayers.forEach((player, index) => {
              if (player.name === command.player) {
                if (player.name === this.clientPlayer.name) {
                  const newBusCard: BusCard = {color: command.privateData['cardColor']};
                  (this._clientPlayer.busCards as BusCard[]).push(newBusCard);
                  this._clientPlayerSubject.next(this._clientPlayer);
                  (this._allPlayers[index].busCards as BusCard[]).push(newBusCard);
                } else {
                  (this._allPlayers[index].busCards as number) += 1;
                }
              }
            });
            this._allPlayersSubject.next(this.allPlayers);
          }
          break;
        case 'discardRoutes':
          if (this.updateLastCommandID(command.id)) {
            if (command.player === this.clientPlayer.name) {
              this._selectingRoutes = false;
              this.selectingRoutesSubject.next(this._selectingRoutes);
              this._allPlayers.forEach((player, index) => {
                if (player.name === command.player) {
                  this._routeDeckSize -= command.data['numCardsKept'];
                  this._routeDeckSizeSubject.next(this._routeDeckSize);
                  this._allPlayers[index].routeCards = (this._allPlayers[index].routeCards as Route[]).concat(command.privateData['cardsKept']);
                  this.allPlayersSubject.next(this._allPlayers);
                }
              });
            } else {
              this._allPlayers.forEach((player, index) => {
                if (player.name === command.player) {
                  this._routeDeckSize -= command.data['numCardsKept'];
                  this._routeDeckSizeSubject.next(this._routeDeckSize);
                  this._allPlayers[index].routeCards += command.data['numCardsKept'];
                  this.allPlayersSubject.next(this._allPlayers);
                }
              });
            }
          }
          // FIXME:add routes to player.
          break;
        case 'endGame':
          this._endGame(command.data.stats);
        break;
        case 'drawTen':
        if (this.updateLastCommandID(command.id)) {
          this._allPlayers.forEach((player, index) => {
            if (player.name === command.player) {
              if (player.name === this.clientPlayer.name) {
                (this._allPlayers[index].busCards as BusCard[]).push(...command.privateData['cards']);
              } else {
                (this._allPlayers[index].busCards as number) += 10;
              }
            }
          });
          this._allPlayersSubject.next(this.allPlayers);
        }
        break;
        case 'claimSegment':
          if (this.updateLastCommandID(command.id)) {
            const { segmentId, name } = command.data;
            const segment: Segment = this._segments.find(s => s.id === segmentId);
            this.markSegmentClaimed(segment);
            this.segmentBeingClaimed = null;
          }
        break;
        case 'showError':
          this.toastError(command.data.message);
        break;
        case 'lastRound':
        if (this.updateLastCommandID(command.id)) {
        }
        default:
        break;
      }
    });
    this.historyService.addItems(commands);
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
        if (this._segments.length === 0) {
          this.mapSegmentColors(segments);
        } else {
          this.mapSegmentColors(this._segments);
        }
        this.locationSubject.next(this._locations);
        this.segmentSubject.next(this._segments);
      });
  }

  private mapSegmentColors(segments: Segment[]) {
    this._segments = segments.map(s => {
      s.color = busColorStringToEnumMap[s.color];
      return s;
    });
  }

  public getFullGame() {
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
        this.historyService.addItems(data.history);
        this.lastCommandId = data.id;
        this._segments = data.segments as Segment[];
      });
  }

  public trySelectBusCard(index: number) {
    // Example of using state:
    this._turnState.drawBusCard(this, index);
  }

  public selectBusCard(index: number) {
    this.serverProxy.selectBusCard(index).then(commands => {
      this.handleCommands(commands);
    }).catch(res => {
      this.toastr.error(res.command.data.message);
    });
  }

  public getSpread(): Promise<BusCard[]> {
    return this.serverProxy.getSpread().then(command => {
      if (command.data['deckSize']) {
        this.deckSizeSubject.next(command.data['deckSize']);
      }
      return command.data['spread'];
    });
  }

  public tryDrawRoutes() {
    this._turnState.drawRouteCards(this);
  }

  public drawRoutes() {
    this.serverProxy.drawRoutes().then(command => {
      this.handleCommands(command);
    }).catch(res => {
      this.toastr.error(res.command.data.message);
    });
  }

  public selectRoutes(selectedRoutes: Route[], rejectedRoutes: Route[]) {
    this.serverProxy.selectRoutes(selectedRoutes, rejectedRoutes).then(commands => {
      this._selectingRoutes = false;
      this.selectingRoutesSubject.next(this._selectingRoutes);
    });
  }

  public openClaimSegmentModal(s: Segment): void {
    this._turnState.openClaimSegmentModal(this, s);
  }

  public claimSegment(segment: Segment, cards: BusCard[]): void {
    this._turnState.claimSegment(this, segment, cards);
  }

  public markSegmentClaimed(segment: Segment): void {
    this._segments.forEach( s => {
      if (s.id === segment.id) {
        s.owner = this._clientPlayer;
      }
    });
    for (let player of this._allPlayers) {
      if (player.name === segment.owner.name) {
        player.busPieces -= segment.length;
        this._allPlayersSubject.next(this._allPlayers);
      }
    }
    this._segmentSubject.next(this._segments);
  }

  private _endGame(stats: GameOverStat[]): void {
    this.stopPolling();
    this.setState('gameover');
    this._gameOverStats = stats;
    this._gameOverStatsSubject.next(this._gameOverStats);
  }

  public removeBusCardFromPlayer(player: Player, card: BusCard): void {
    if (!Array.isArray(player.busCards)) {
      player.busCards -= 1;
      return;
    }
    const indexToDelete: number = player.busCards.findIndex((c: BusCard) => c.color === card.color);
    player.busCards.splice(indexToDelete, 1);
    this._allPlayers.forEach( p => {
      if (p.name === player.name) {
        p.busCards = player.busCards;
      }
    });
    this._allPlayersSubject.next(this._allPlayers);
  }

  public toastError(error: string) {
    this.toastr.error(error);
  }

}
