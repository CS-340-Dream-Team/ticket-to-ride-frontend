import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../../../types';
import { Message } from '../../../types/message/message.type';
import { ChatManagerService } from '../../../services/chat-manager/chat-manager.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  @Input() message: Message;
  @Input() player: Player;

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
