import { Component, OnInit } from '@angular/core';
import { BusCard, BusColor } from '../../../types';
import { GamePlayManagerService } from '../../../services';

@Component({
  selector: 'app-deck-bar',
  templateUrl: './deck-bar.component.html',
  styleUrls: ['./deck-bar.component.scss']
})
export class DeckBarComponent implements OnInit {

  public spread: BusCard[];
  public numBuses = 45;
  public numRoutes = 16;


  constructor(private gamePlayManager: GamePlayManagerService) {
    gamePlayManager.spreadSubject.subscribe({
      next: (spread) => this.spread = spread
    });
    gamePlayManager.deckSizeSubject.subscribe({
      next: (deckSize) => this.numBuses = deckSize
    });
    gamePlayManager.getSpread().then(spread => {
      this.spread = spread;
    });
   }

  ngOnInit() {
  }

  getColorClass(card: BusCard) {
    return 'card-color-' + BusColor[card.color].toLowerCase();
  }

}
