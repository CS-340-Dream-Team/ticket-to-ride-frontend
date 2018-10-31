import { Injectable } from '@angular/core';
import { GamePlayManagerService } from '../game-play-manager/game-play-manager.service';
import { ToastrService } from 'ngx-toastr';
import { BusCard, BusColor, Route } from 'src/app/types';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  timeBetweenCommands: number = 3000;

  constructor(private gamePlayService: GamePlayManagerService, private toastr: ToastrService) {
    
  }

  async drive() {
    let player = this.gamePlayService.clientPlayer;

    this.toastr.success(`Updating ${player.name}'s points`);
    await this.delay(this.timeBetweenCommands);
    this.gamePlayService.clientPlayer.points = 50;

    this.toastr.success(`Adding train cards for ${player.name}`);
    await this.delay(this.timeBetweenCommands);
    let busCards = this.gamePlayService.clientPlayer.busCards as BusCard[];
    busCards.push({color: BusColor.Red});
    busCards.push({color: BusColor.Red});

    this.toastr.success(`Removing train cards for ${player.name}`);
    await this.delay(this.timeBetweenCommands);
    busCards = [];

    this.toastr.success(`Adding destination cards for ${player.name}`);
    await this.delay(this.timeBetweenCommands);
    let routeCards = this.gamePlayService.clientPlayer.routeCards as Route[];
    routeCards.push({color: BusColor.Red});
    busCards.push({color: BusColor.Red});

    this.toastr.success(`Removing destination cards for ${player.name}`);
    await this.delay(this.timeBetweenCommands);
    routeCards = [];

    this.toastr.success(`Updating number of train CARDS for opponent players`);
    await this.delay(this.timeBetweenCommands);

    this.toastr.success(`Updating number of train CARS for opponent players`);
    await this.delay(this.timeBetweenCommands);

    this.toastr.success(`Updating number of destination cards for opponent players`);
    await this.delay(this.timeBetweenCommands);

    this.toastr.success(`Updating the face up cards of the deck`);
    await this.delay(this.timeBetweenCommands);

    this.toastr.success(`Updating the number of face down cards of the deck`);
    await this.delay(this.timeBetweenCommands);

    this.toastr.success(`Updating the number of destination cards in deck`);
    await this.delay(this.timeBetweenCommands);

    this.toastr.success("Claiming route from Baseball Stadium to Smith Field House");
    await this.delay(this.timeBetweenCommands);
    this.gamePlayService.setSegmentOwner(21, player);
  }

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
