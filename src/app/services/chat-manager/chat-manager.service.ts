import { Injectable } from '@angular/core';
import { Player } from '../../types';
import { ServerProxyService } from '../server-proxy/server-proxy.service';
import { AuthManagerService } from '../auth-manager/auth-manager.service';
import { Message } from '../../types/message/message.type';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatManagerService {
  private _messagesSubject = new Subject<Message[]>();
  private _currentPlayer: Player;
  private _messages: Message[];

  constructor(private serverProxy: ServerProxyService, private authManager: AuthManagerService) {
    // this._currentPlayer = authManager.currentUser; //Add player to user so that I can grab that? Once they choose color.
    this._messages = [];
    this._currentPlayer = {name: "Test Player", color: 2};
  }

  public get currentPlayer() {
    return this._currentPlayer;
  }

  public get messagesSubject() {
    return this._messagesSubject;
  }


  public addMessage(chatInfo: {messageText: string, prevTimestamp: number}) {
    return this.serverProxy.addMessage(chatInfo).then(messages => {
      if (messages.command.type === "updateMessageList") {
        console.log(`incoming message: ${JSON.stringify(messages.command.data.messages)}`);
        this._messages = this._messages.concat(messages.command.data.messages);
        this._messagesSubject.next(this._messages);
        console.log("this._messages");
        console.log(JSON.stringify(this._messages));
        console.log("this._currentPLayer");
        console.log(this._currentPlayer);
      }
    });
  }
}
