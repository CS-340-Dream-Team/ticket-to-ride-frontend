import { Component, OnInit } from '@angular/core';
import {
  BusCard,
  BusColor,
  Player,
  PlayerColor,
  Route
} from 'src/app/types';
import { GamePlayManagerService } from 'src/app/services';

@Component({
  selector: 'app-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss']
})
export class PlayerBarComponent {

  public playerColor = PlayerColor;

  public players: Player[] = [];

  public playerTurn: string;

  public busCardCounts = {
    red: 0,
    orange: 0,
    yellow: 0,
    green: 0,
    blue: 0,
    purple: 0,
    black: 0,
    white: 0,
    rainbow: 0
  };

  public routeCards: Route[];

  constructor(
    private gamePlayManager: GamePlayManagerService
  ) {
    this.gamePlayManager.allPlayersSubject.subscribe({
      next: players => {
        this.players = players;

        this.playerTurn = this.players[0].name;

        const clientPlayerArr = this.players.filter(player => this.isCurrentPlayer(player));
        if (clientPlayerArr.length) {
          const clientPlayer = clientPlayerArr[0];
          this.routeCards = <Route[]>clientPlayer.routeCards;
          this.countBusCards(<BusCard[]>clientPlayer.busCards);
        }
      }
    });

    this.gamePlayManager.clientPlayerSubject.subscribe({
      next: clientPlayer => {
        this.players.forEach((player, index, array) => {
          if (player.name === clientPlayer.name) {
            array[index] = clientPlayer;
          }
        });
      }
    });
    this.gamePlayManager.playerTurnSubject.subscribe({
        next: (turnName) => this.playerTurn = turnName
      }
    );
  }

  /**
   * Counts the number of each type bus card
   * @param clientPlayer the client player
   */
  private countBusCards(busCards: BusCard[]) {
    this.busCardCounts.red = busCards.filter(card => card.color === BusColor.Red).length;
    this.busCardCounts.orange = busCards.filter(card => card.color === BusColor.Orange).length;
    this.busCardCounts.yellow = busCards.filter(card => card.color === BusColor.Yellow).length;
    this.busCardCounts.green = busCards.filter(card => card.color === BusColor.Green).length;
    this.busCardCounts.blue = busCards.filter(card => card.color === BusColor.Blue).length;
    this.busCardCounts.purple = busCards.filter(card => card.color === BusColor.Purple).length;
    this.busCardCounts.black = busCards.filter(card => card.color === BusColor.Black).length;
    this.busCardCounts.white = busCards.filter(card => card.color === BusColor.White).length;
    this.busCardCounts.rainbow = busCards.filter(card => card.color === BusColor.Rainbow).length;
  }

  public isCurrentPlayer(player) {
    return player.name === this.gamePlayManager.clientPlayer.name;
  }

  isTurn(player: Player) {
    if (player.name === this.playerTurn) {
      return true;
    }
    return false;
  }
}

