import { Component, OnInit } from '@angular/core';
import { Game } from '../../../types';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  constructor() { }

  game: Game = null;

  ngOnInit() {
  }
  
}
