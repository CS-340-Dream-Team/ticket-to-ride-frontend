import { Component, OnInit } from '@angular/core';
import { ChatManagerService } from '../../services/chat-manager/chat-manager.service';
import { ToastrService } from 'ngx-toastr';
import { Player } from '../../types';
import { Message } from '../../types/message/message.type';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  userId: string = 'a88das9sd9a-das8d9asd98a98d';
  currentPlayer: Player;
  inputMessage: Message;
  // messages: string[] = [];
  messages: Message[];
  showChat: boolean;

  constructor(private chatManager: ChatManagerService, private toastr: ToastrService) { 
    // this.messages.push('Hello');
    this.currentPlayer = chatManager.currentPlayer;
    this.showChat = false;
    this.messages = chatManager.messages;
    this.inputMessage = {message: "", timestamp: 0, sender: null}
  }

  ngOnInit() {
  }

  addMessage(e) {
    e.preventDefault();
      this.messages.push(this.inputMessage);
      this.chatManager.addMessage({message: this.inputMessage, prevTimestamp: 0}).then(response => {
        this.inputMessage.message = '';
        this.messages = this.chatManager.messages;
        console.log(this.messages);
      }).catch(res => {
        this.toastr.error(res.message);
      });
  }

  openChat() {
    this.showChat = true;
  }
  
  closeChat() {
    this.showChat = false;
  }

}
