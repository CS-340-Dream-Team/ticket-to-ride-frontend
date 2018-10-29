import { Injectable } from '@angular/core';
import { GamePlayManagerService } from '../game-play-manager/game-play-manager.service';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  constructor(private gamePlayService: GamePlayManagerService) {
    
  }

  drive() {
    let player = this.gamePlayService.clientPlayer;
    this.gamePlayService.setSegmentOwner(0, player);
  }
}
