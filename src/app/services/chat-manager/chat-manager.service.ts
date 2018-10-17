import { Injectable } from '@angular/core';
import { Player } from '../../types';
import { ServerProxyService } from '../server-proxy/server-proxy.service';
import { AuthManagerService } from '../auth-manager/auth-manager.service';
import { Message } from '../../types/message/message.type';

@Injectable({
  providedIn: 'root'
})
export class ChatManagerService {
  private _currentPlayer: Player;
  private _messages: Message[] = [];

  public get currentPlayer() {
    return this._currentPlayer;
  }

  public get messages() {
    return this._messages;
  }

  constructor(private serverProxy: ServerProxyService, private authManager: AuthManagerService) {
    this._currentPlayer = authManager.currentUser;
  }

  public addMessage(chatInfo: {message: Message, prevTimestamp: number}) {
    return this.serverProxy.addMessage(chatInfo).then(messages => {
      if (messages.command.type === "updateMessageList") {
        this._messages = this._messages.concat(messages.command.data);
      }
    });
  }
}
