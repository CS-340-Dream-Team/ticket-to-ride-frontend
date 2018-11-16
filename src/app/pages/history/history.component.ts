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
    // this.playerColors['Betty the Bot'] = 1;
    this.gameplayService.allPlayersSubject.subscribe({
      next: (players) => players.forEach(player => {
        this.playerColors[player.name] = player.color;
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

  getPlayerColor(command: Command) {
    if (command.type === "incrementTurn") {
      let data = command.data as {"playerTurnName": string}
      return this.playerColors[data.playerTurnName];
    } else {
      let name = command.player;
      return this.playerColors[name];
    }
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
