import { Component, OnInit } from '@angular/core';
import { Message, Player, Command, PlayerColor } from 'src/app/types';
import { NgxAutoScroll } from 'ngx-auto-scroll';
import { GamePlayManagerService } from 'src/app/services';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  history: Command[];
  fakeHistory: Command[];
  playerColors = {};
  showHistory: boolean;

  constructor(private gameplayService: GamePlayManagerService) { 
    this.showHistory = false;
    this.history = [];
    this.playerColors['Betty the Bot'] = 1;
    this.fakeHistory = [
      {
        type: 'drawRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot drew 3 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
      {
        type: 'discardRoutes',
        data: {},
        player: 'Betty the Bot',
        message: 'Betty the bot discarded 2 routes'
      },
    ];
    this.gameplayService.allPlayersSubject.subscribe({
      next: (players) => players.forEach(player => {
        this.playerColors[player.name] = player.color;
        console.log(JSON.stringify(this.playerColors));
      })
    });
    this.gameplayService.historySubject.subscribe({
      next: (history) => this.history = history
    });
  }

  ngOnInit() {
  }

  openHistory() {
    this.showHistory = true;
  }
  
  closeHistory() {
    this.showHistory = false;
  }

  toString(command: Command) {
    return JSON.stringify(command);
  }

  getPlayerColor(name: string) {
    return this.playerColors[name];
  }

  convertDate(timestamp: number) {
    let date = new Date(timestamp);
    let hour = date.getHours();
    let meridiem = hour >= 12 ? ' PM' : ' AM';
    let currentTime = ((hour + 11) % 12 + 1) + ':' + date.getMinutes() + meridiem + 
                      ", " + date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
    return currentTime;
  }

}
