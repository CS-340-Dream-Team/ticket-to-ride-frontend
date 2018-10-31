import { Component, OnInit } from '@angular/core';
import { BusCard, BusColor } from '../../../types';

@Component({
  selector: 'app-deck-bar',
  templateUrl: './deck-bar.component.html',
  styleUrls: ['./deck-bar.component.scss']
})
export class DeckBarComponent implements OnInit {

  private spread: BusCard[];
  private numBuses = 45;
  private numRoutes = 16;


  constructor() {
    this.spread = [
      {
        color: BusColor.Blue
      },
      {
        color: BusColor.White
      },
      {
        color: BusColor.Rainbow
      },
      {
        color: BusColor.Yellow
      },
      {
        color: BusColor.Red
      }
    ];
   }

  ngOnInit() {
  }

  getColorClass(card: BusCard) {
    return 'card-color-' + BusColor[card.color].toLowerCase();
  }

}
