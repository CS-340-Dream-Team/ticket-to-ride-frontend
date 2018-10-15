import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  userId: string = 'a88das9sd9a-das8d9asd98a98d';
  inputMessage: string;
  messages: string[] = [];
  showChat: boolean;

  constructor() { 
    this.messages.push('Helllloooooooo');
    this.showChat = false;
  }

  ngOnInit() {
  }

  sendMessage(event) {
    if(event.keyCode == 13) {
      this.messages.push(this.inputMessage);
      this.inputMessage = '';
    }
  }

  openChat() {
    this.showChat = true;
  }
  
  closeChat() {
    this.showChat = false;
  }

}
