import { Injectable } from '@angular/core';
import { GamePlayManagerService } from '../game-play-manager/game-play-manager.service';
import { ToastrService } from 'ngx-toastr';
import { BusCard, BusColor, Route, Player } from 'src/app/types';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  timeBetweenCommands: number = 3000;
  players: Player[];

  constructor(private gamePlayService: GamePlayManagerService, private toastr: ToastrService) {
    gamePlayService.allPlayersSubject.subscribe({
      next: (players) => this.players = players
    });
  }

  async drive() {
    let player = this.gamePlayService.clientPlayer;
    let opponent = this.gamePlayService.randomOpponent;

    this.toastr.success(`Updating ${player.name}'s points`);
    await this.delay(this.timeBetweenCommands);
    this.gamePlayService.clientPlayer.points = 50;
    this.gamePlayService.updateClientPlayer();

    this.toastr.success(`Adding train cards for ${player.name}`);
    await this.delay(this.timeBetweenCommands);
    let busCards = this.gamePlayService.clientPlayer.busCards as BusCard[];
    busCards.push({color: BusColor.Red});
    busCards.push({color: BusColor.Red});
    this.gamePlayService.updateClientPlayer();

    this.toastr.success(`Removing train cards for ${player.name}`);
    await this.delay(this.timeBetweenCommands);
    busCards = [];
    this.gamePlayService.updateClientPlayer();

    this.toastr.success(`Adding destination cards for ${player.name}`);
    await this.delay(this.timeBetweenCommands);
    let routeCards = this.gamePlayService.clientPlayer.routeCards as Route[];
    routeCards.push({
      "name": "Gains 'n' Grades",
      "points": 4,
      "start": {
         "name": "The Testing Center",
         "latLong": {
            "lat": 40.245433,
            "long": -111.652399
         }
      },
      "end": {
         "name": "Vasa",
         "latLong": {
            "lat": 40.240334,
            "long": -111.642054
         }
      }
    });
    routeCards.push({
         "name": "America's Passtime",
         "points": 5,
         "start": {
            "name": "J-Dawgs",
            "latLong": {
               "lat": 40.245286,
               "long": -111.646318
            }
         },
         "end": {
            "name": "Baseball Stadium",
            "latLong": {
               "lat": 40.254821,
               "long": -111.651125
            }
         }
    });
    this.gamePlayService.updateClientPlayer();

    this.toastr.success(`Removing destination cards for ${player.name}`);
    await this.delay(this.timeBetweenCommands);
    routeCards = [];
    this.gamePlayService.updateClientPlayer();

    this.toastr.success(`Updating number of train CARDS for opponent players`);
    await this.delay(this.timeBetweenCommands);
    (opponent.busCards as number) += 2;
    this.gamePlayService.updateOpponent(opponent);

    this.toastr.success(`Updating number of train CARS for opponent players`);
    await this.delay(this.timeBetweenCommands);
    opponent.busPieces -= 5;
    this.gamePlayService.updateOpponent(opponent);

    this.toastr.success(`Updating number of destination cards for opponent players`);
    await this.delay(this.timeBetweenCommands);
    (opponent.routeCards as number) += 5;
    this.gamePlayService.updateOpponent(opponent);

    this.toastr.success(`Updating the face up cards of the deck`);
    await this.delay(this.timeBetweenCommands);
    this.gamePlayService.updateSpread([{color: BusColor.Blue},
                                       {color: BusColor.Rainbow},
                                       {color: BusColor.Yellow},
                                       {color: BusColor.Rainbow},
                                       {color: BusColor.Blue}]);

    this.toastr.success(`Updating the number of face down cards of the deck`);
    await this.delay(this.timeBetweenCommands);
    this.gamePlayService.updateDeckSize(76);

    this.toastr.success(`Updating the number of destination cards in deck`);
    await this.delay(this.timeBetweenCommands);
    this.gamePlayService.updateRouteDeckSize(7);

    this.toastr.success("Claiming route from Baseball Stadium to Smith Field House. (mouse over)");
    await this.delay(this.timeBetweenCommands);
    this.gamePlayService.setSegmentOwner(21, player);
  }

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
