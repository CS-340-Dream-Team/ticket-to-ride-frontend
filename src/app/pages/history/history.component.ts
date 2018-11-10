import { Component, OnInit } from '@angular/core';
import { Message, Player, Command } from 'src/app/types';
import { NgxAutoScroll } from 'ngx-auto-scroll';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  history: Command[];
  showHistory: boolean;
  currentPlayer: Player = {name:'Betty the Bot',color:1,points:0,busPieces:0,busCards:0,routeCards:0}

  constructor() { 
    this.showHistory = false;
    this.history = [
      {
        text: 'Betty the Bot Claimed a segment',
        player: {name:'Betty the Bot',color:1,points:0,busPieces:0,busCards:0,routeCards:0},
      },
      {
        text: 'Drew a card',
        player: {name:'Barry the Bot',color:2,points:0,busPieces:0,busCards:0,routeCards:0},
      },
      {
        text: 'Drew 3 route cards',
        player: {name:'Bert the Bot',color:3,points:0,busPieces:0,busCards:0,routeCards:0},
      },
      {
        text: 'Discarded 1 route card',
        player: {name:'Bert the Bot',color:3,points:0,busPieces:0,busCards:0,routeCards:0},
      },
    ]
  }

  ngOnInit() {
  }

  openHistory() {
    this.showHistory = true;
  }
  
  closeHistory() {
    this.showHistory = false;
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
