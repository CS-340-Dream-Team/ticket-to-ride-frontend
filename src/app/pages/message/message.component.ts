import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../types';
import { Message } from '../../types/message/message.type';
import { ChatManagerService } from '../../services/chat-manager/chat-manager.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  @Input() message: Message;
  @Input() player: User;

  constructor(private chatManager: ChatManagerService) { 
  }

  isSender(): boolean {
    return true;
  }

  isSender2(): boolean {
    return false;
  }

  ngOnInit() {
  }

}
