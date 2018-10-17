import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../../types';
import { Message } from '../../types/message/message.type';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  @Input() message: Message;
  @Input() player: Player;

  constructor() { }

  isSender(): boolean {
    return true;
  }

  isSender2(): boolean {
    return false;
  }

  ngOnInit() {
  }

}
