import { Component, OnInit } from '@angular/core';
import { Message, Player, Command, PlayerColor } from 'src/app/types';
import { NgxAutoScroll } from 'ngx-auto-scroll';
import { GamePlayManagerService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  history: Command[];
  prevId: number;
  playerColors = {};
  showHistory: boolean;

  constructor(private gameplayService: GamePlayManagerService, private toastr: ToastrService) { 
    this.showHistory = false;
    this.history = [];
    this.prevId = -1;
    this.gameplayService.allPlayersSubject.subscribe({
      next: (players) => players.forEach(player => {
        this.playerColors[player.name] = player.color;
      })
    });
    this.gameplayService.historySubject.subscribe({
      next: (history) => {
        this.history = history;
        this.toastNewHistory();
        this.prevId = this.history[this.history.length - 1].id;
      }
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

  toastNewHistory() {
    this.history.forEach(command => {
      if (command.id > this.prevId) {
        this.toastr.info(command.message, '', {
          // toastClass: 'color-' + this.getPlayerColor(command)
          // toastClass: "{ background-color: red }"
          // toastClass: "color-0"
        });
      }
    });
  }

  toString(command: Command) {
    return JSON.stringify(command);
  }

  getPlayerColor(command: Command) {
    let name = command.player;
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
