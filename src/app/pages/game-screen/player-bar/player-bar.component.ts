import { Component, OnInit } from '@angular/core';
import { Player, PlayerColor } from 'src/app/types';

@Component({
  selector: 'app-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss']
})
export class PlayerBarComponent implements OnInit {

  public playerColor = PlayerColor;

  public players: Player[] = [
    {
      name: 'Andrew',
      color: PlayerColor.Blue
    },
    {
      name: 'Carter',
      color: PlayerColor.Yellow
    },
    {
      name: 'Berkley',
      color: PlayerColor.Green
    },
    {
      name: 'Michael',
      color: PlayerColor.Red
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
