import { Component, OnInit } from '@angular/core';
import { Player, PlayerColor } from 'src/app/types';

@Component({
  selector: 'app-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss']
})
export class PlayerBarComponent implements OnInit {

  public playerColor = PlayerColor;

  public players = [
    {
      name: 'Andrew',
      color: PlayerColor.Blue,
      numRoutes: 3,
      points: 10,
      numCards: 40,
      numBusses: 40
    },
    {
      name: 'Carter',
      color: PlayerColor.Yellow,
      numRoutes: 6,
      points: 20,
      numCards: 40,
      numBusses: 40
    },
    {
      name: 'Berkley',
      color: PlayerColor.Green,
      numRoutes: 1,
      points: 2,
      numCards: 40,
      numBusses: 40
    },
    {
      name: 'Michael',
      color: PlayerColor.Red,
      numRoutes: 6,
      points: 1,
      numCards: 40,
      numBusses: 40
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  public isCurrentPlayer(player) {
    return player.name === 'Carter';
  }

}
