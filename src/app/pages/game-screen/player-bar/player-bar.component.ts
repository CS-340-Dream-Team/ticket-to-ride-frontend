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
      stars: 10,
    },
    {
      name: 'Carter',
      color: PlayerColor.Yellow,
      numRoutes: 6,
      stars: 6,
    },
    {
      name: 'Berkley',
      color: PlayerColor.Green,
      numRoutes: 1,
      stars: 2,
    },
    {
      name: 'Michael',
      color: PlayerColor.Red,
      numRoutes: 6,
      stars: 1,
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  public isCurrentPlayer(player) {
    return player.name === 'Carter';
  }

}
