import { Component, OnInit } from '@angular/core';
import { ChatManagerService } from '../../services/chat-manager/chat-manager.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../types';
import { Message } from '../../types/message/message.type';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  currentPlayer: User;
  inputMessage: Message;
  // messages: string[] = [];
  messages: Message[];
  showChat: boolean;

  constructor(private chatManager: ChatManagerService, private toastr: ToastrService) { 
    // chatManager.currentPlayerSubject.subscribe({
    //   next: (player) => this.currentPlayer = player
    // });
    this.currentPlayer = chatManager.currentPlayer;
    chatManager.messagesSubject.subscribe({
      next: (messages) => this.messages = messages
    });
    this.showChat = false;
    this.inputMessage = {message: '', timestamp: 0, sender: this.currentPlayer}
  }

  ngOnInit() {
  }

  addMessage(e) {
    e.preventDefault();
    this.chatManager.addMessage({message: this.inputMessage, prevTimestamp: 0}).then(response => {
      this.inputMessage.message = '';
      console.log(`component messages: ${JSON.stringify(this.messages)}`);
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
