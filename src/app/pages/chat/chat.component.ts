import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  currentPlayer: Player;
  inputMessage: string;
  messages: Message[];
  showChat: boolean;
  @ViewChild('chat_window') chat_window: ElementRef;

  constructor(private chatManager: ChatManagerService, private toastr: ToastrService) { 
    this.currentPlayer = chatManager.currentPlayer;
    console.log(`player: ${this.currentPlayer}`)
    chatManager.messagesSubject.subscribe({
      next: (messages) => this.messages = messages
    });
    this.showChat = false;
    this.inputMessage = '';
  }

  ngOnInit() {
  }

  addMessage(e) {
    e.preventDefault();
    this.chatManager.addMessage({messageText: this.inputMessage, prevTimestamp: 0}).then(response => {
      this.inputMessage = '';
      //TODO: scroll to the bottom of this.chat_window
      console.log(`component messages: ${JSON.stringify(this.messages)}`);
    }).catch(res => {
      this.toastr.error(res.message);
    });
  }

  @ViewChild('input') nameField: ElementRef;
  openChat() {
    this.showChat = true;
    setTimeout(()=>{
      this.nameField.nativeElement.focus(); //People online said this is a security issue for XSS attacks for example.
    },100);
  }
  
  closeChat() {
    this.showChat = false;
  }

}
