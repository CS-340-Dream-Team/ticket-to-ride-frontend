import { Component, OnInit } from '@angular/core';
import { Message, Player } from 'src/app/types';
import { NgxAutoScroll } from 'ngx-auto-scroll';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  history: Message[];
  showHistory: boolean;
  currentPlayer: Player = {name:'Betty the Bot',color:1,points:0,busPieces:0,busCards:0,routeCards:0}

  constructor() { 
    this.showHistory = false;
    this.history = [
      {
        messageText: 'Claimed a segment',
        sender: {name:'Betty the Bot',color:1,points:0,busPieces:0,busCards:0,routeCards:0},
        timestamp: 1541792127900
      },
      {
        messageText: 'Drew a card',
        sender: {name:'Barry the Bot',color:2,points:0,busPieces:0,busCards:0,routeCards:0},
        timestamp: 1541792557900
      },
      {
        messageText: 'Drew 3 route cards',
        sender: {name:'Bert the Bot',color:3,points:0,busPieces:0,busCards:0,routeCards:0},
        timestamp: 1541792588900
      },
      {
        messageText: 'Discarded 1 route card',
        sender: {name:'Bert the Bot',color:3,points:0,busPieces:0,busCards:0,routeCards:0},
        timestamp: 1541792597900
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
