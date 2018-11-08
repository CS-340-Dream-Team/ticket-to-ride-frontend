import { Injectable } from '@angular/core';
import { Player, Command } from '../../types';
import { ServerProxyService } from '../server-proxy/server-proxy.service';
import { Message } from '../../types/message/message.type';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { GamePlayManagerService } from '../game-play-manager/game-play-manager.service';

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
    private gameplayService: GamePlayManagerService,
    private toastr: ToastrService) {
    this._messages = [];
    this.gameplayService.clientPlayerSubject.subscribe({
      next: (player) => this._currentPlayer = player
    });
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

  poll(serverProxy: ServerProxyService) {
    let timestamp = 0;
    if (this._messages.length > 0) {
      timestamp = this._messages[this._messages.length - 1].timestamp;
    }
    serverProxy.getUpdatedMessages(timestamp).then(commands => {
      this.handleCommands(commands);
    }).catch(res => {
      this.toastr.error(res.message);
    });
    setTimeout(() => {
      this.poll(serverProxy);
    }, 1000);
  }

  private handleCommands(commands: Command[]) {
    if (commands.length !== 0) {
      this._messageNotification += commands.length;
      this._messageNotificationSubject.next(this._messageNotification);
    }
    commands.forEach(command => {
      console.log(command.type);
      if (command.type === 'updateMessageList') {
        this._messages = this._messages.concat(command.data);
        this._messagesSubject.next(this._messages);
      }
      else if (command.type === ':turn') {
        console.log("made it");
        this.gameplayService.incrementplayerTurn();
      }
    });
  }
}
