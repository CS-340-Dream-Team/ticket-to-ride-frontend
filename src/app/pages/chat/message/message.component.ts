import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Player } from '../../../types';
import { Message } from '../../../types/message/message.type';
import { ChatManagerService } from '../../../services/chat-manager/chat-manager.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message: Message;
  @Input() player: Player;
  @Input() dateString: string;

  constructor() { 
  }

  isSender(): boolean {
    if (this.message.sender.name  === this.player.name) {
      return true;
    }
    return false;
  }

  ngOnInit() {
  }

}
