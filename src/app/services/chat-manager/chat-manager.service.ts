import { Injectable } from '@angular/core';
import { Player, Command } from '../../types';
import { ServerProxyService } from '../server-proxy/server-proxy.service';
import { AuthManagerService } from '../auth-manager/auth-manager.service';
import { Message } from '../../types/message/message.type';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ChatManagerService {
  private _messagesSubject = new Subject<Message[]>();
  private _currentPlayer: Player;
  private _messages: Message[];
  private _messageNotification: number;
  private _messageNotificationSubject = new Subject<number>();

  constructor(
    private serverProxy: ServerProxyService, 
    private authManager: AuthManagerService,
    private toastr: ToastrService) {
    // this._currentPlayer = authManager.currentUser; //Add player to user so that I can grab that? Once they choose color.
    this._messages = [];
    // this._currentPlayer = {name: "Test Player", color: 2};
    this._currentPlayer = { name: authManager.currentUser.name, color: 2 };
    this.poll(serverProxy);
  }

  public get currentPlayer() {
    return this._currentPlayer;
  }

  public get messagesSubject() {
    return this._messagesSubject;
  }

  public get messageNotificationSubject() {
    return this._messageNotificationSubject;
  }

  public resetMessageNotification() {
    this._messageNotification = 0;
    this._messageNotificationSubject.next(0);
  }

  public addMessage(chatInfo: {messageText: string, prevTimestamp: number}) {
    this._messageNotification = 0;
    return this.serverProxy.addMessage(chatInfo).then(commands => {
      this.handleCommands(commands);
    }).catch(res => {
      this.toastr.error(res.message);
    });
  }

  private poll(serverProxy: ServerProxyService) {
    // if (this._messages.length > 0) {
      let timestamp = 0;
      if (this._messages.length > 0) {
        timestamp = this._messages[this._messages.length - 1].timestamp;
      }
      serverProxy.getUpdatedMessages(timestamp).then(commands => {
        this.handleCommands(commands);
      }).catch(res => {
        this.toastr.error(res.message);
      });
    // }
    setTimeout(() => {
      this.poll(serverProxy);
    }, 3000);
  }

  private handleCommands(commands: Command[]) {
    if (commands.length !== 0) {
      this._messageNotification += commands.length;
      this._messageNotificationSubject.next(this._messageNotification);
    }
    commands.forEach(command => {
      if (command.type === 'updateMessageList') {
        this._messages = this._messages.concat(command.data);
        this._messagesSubject.next(this._messages);
      }
    });
  }
}
