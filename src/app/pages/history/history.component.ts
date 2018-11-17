import { Component, OnInit } from '@angular/core';
import { Command } from 'src/app/types';
import { GamePlayManagerService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import { HistoryManagerService } from 'src/app/services/history-manager/history-manager.service';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  history: Command[];
  numNewItems: number;
  playerColors = {};
  showHistory: boolean;

  constructor(
    private gameplayService: GamePlayManagerService,
    private historyService: HistoryManagerService, 
    private toastr: ToastrService) { 
    this.showHistory = false;
    this.history = [];
    this.gameplayService.allPlayersSubject.subscribe({
      next: (players) => players.forEach(player => {
        this.playerColors[player.name] = player.color;
      })
    });
    this.historyService.numNewItemsSubject.subscribe({
      next: (numNewItems) => this.numNewItems = numNewItems
    })
    this.historyService.historySubject.subscribe({
      next: (newHistory) => {
        this.history = newHistory;
        this.toastNewHistory();
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
    if (this.numNewItems !== this.history.length) {
      let start = this.history.length - this.numNewItems;
      for (let i = start; i < this.history.length; i++) {
        this.toastr.info(this.history[i].message);      
      }
    }
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
