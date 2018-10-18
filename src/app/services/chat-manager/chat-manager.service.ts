import { Injectable } from '@angular/core';
import { User } from '../../types';
import { ServerProxyService } from '../server-proxy/server-proxy.service';
import { AuthManagerService } from '../auth-manager/auth-manager.service';
import { Message } from '../../types/message/message.type';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatManagerService {
  // private _currentPlayerSubject = new Subject<Player>();
  private _messagesSubject = new Subject<Message[]>();
  private _currentPlayer: User;
  private _messages: Message[];

  // public get currentPlayerSubject() {
  //   return this._currentPlayerSubject;
  // }

  public get currentPlayer() {
    return this._currentPlayer;
  }

  public get messagesSubject() {
    return this._messagesSubject;
  }

  constructor(private serverProxy: ServerProxyService, private authManager: AuthManagerService) {
    this._currentPlayer = authManager.currentUser;
    this._messages = [];
  }

  public addMessage(chatInfo: {message: Message, prevTimestamp: number}) {
    return this.serverProxy.addMessage(chatInfo).then(messages => {
      if (messages.command.type === "updateMessageList") {
        this._messages = this._messages.concat(messages.command.data.messages as Message[]);
        this._messagesSubject.next(this._messages);
        console.log("this._messages");
        console.log(this._messages);
        console.log("this._currentPLayer");
        console.log(this._currentPlayer);
      }
    });
  }
}
