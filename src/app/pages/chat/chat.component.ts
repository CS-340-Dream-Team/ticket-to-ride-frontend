import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatManagerService } from '../../services/chat-manager/chat-manager.service';
import { ToastrService } from 'ngx-toastr';
import { Player } from '../../types';
import { Message } from '../../types/message/message.type';
import { NgxAutoScroll } from 'ngx-auto-scroll';
import { GamePlayManagerService } from 'src/app/services';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  currentPlayer: Player;
  inputMessage: string;
  messages: Message[];
  showChat: boolean;
  messageNotification: number;
  @ViewChild('input') nameField: ElementRef;
  @ViewChild(NgxAutoScroll) ngxAutoScroll: NgxAutoScroll;

  constructor(
    private chatManager: ChatManagerService,
    private toastr: ToastrService,
    private gameplayService: GamePlayManagerService) { 
    this.currentPlayer = chatManager.currentPlayer;
    chatManager.messagesSubject.subscribe({
      next: (messages) => this.messages = messages
    });
    chatManager.messageNotificationSubject.subscribe({
      next: (numMessages) => this.messageNotification = numMessages
    });
    this.gameplayService.clientPlayerSubject.subscribe({
      next: (player) => this.currentPlayer = player
    })
    this.showChat = false;
    this.inputMessage = '';
  }

  ngOnInit() {
  }

  addMessage(e) {
    e.preventDefault();
    let timestamp = 0;
    if (this.messages && this.messages.length > 0) {
      timestamp = this.messages[this.messages.length - 1].timestamp;
    }
    this.chatManager.addMessage({messageText: this.inputMessage, prevTimestamp: timestamp}).then(response => {
      this.inputMessage = '';
    }).catch(res => {
      this.toastr.error(res.message);
    });
  }

  openChat() {
    this.showChat = true;
    setTimeout(()=>{
      this.nameField.nativeElement.focus();
    },100);
    //TODO: scroll to bottom when chat is opened
    // this.ngxAutoScroll.forceScrollDown();
    this.chatManager.resetMessageNotification();
  }
  
  closeChat() {
    this.showChat = false;
    this.chatManager.resetMessageNotification();
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
