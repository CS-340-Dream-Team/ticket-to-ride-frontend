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

  constructor(
    private serverProxy: ServerProxyService, 
    private authManager: AuthManagerService,
    private toastr: ToastrService) {
    // this._currentPlayer = authManager.currentUser; //Add player to user so that I can grab that? Once they choose color.
    this._messages = [];
    this._currentPlayer = {name: "Test Player", color: 2};
    this.poll(serverProxy)
  }

  public get currentPlayer() {
    return this._currentPlayer;
  }

  public get messagesSubject() {
    return this._messagesSubject;
  }


  public addMessage(chatInfo: {messageText: string, prevTimestamp: number}) {
    return this.serverProxy.addMessage(chatInfo).then(commands => {
      // commands.forEach(command => {
      //   if (command.type === "updateMessageList") {
      //     this._messages = this._messages.concat(command.data.messages);
      //     this._messagesSubject.next(this._messages);
      //   }
      // });
      this.handleCommands(commands);
      // if (command.type === "updateMessageList") {
      //   console.log(`incoming message: ${JSON.stringify(command.data.messages)}`);
      //   this._messages = this._messages.concat(command.data.messages);
      //   this._messagesSubject.next(this._messages);
      //   console.log("this._messages");
      //   console.log(JSON.stringify(this._messages));
      //   console.log("this._currentPLayer");
      //   console.log(this._currentPlayer);
      // }
    }).catch(res => {
      this.toastr.error(res.message);
    });
  }

  private poll(serverProxy: ServerProxyService) {
    if (this._messages.length > 0) {
      let timestamp = this._messages[this._messages.length - 1].timestamp
      serverProxy.getUpdatedMessages(timestamp).then(commands => {
        this.handleCommands(commands);
      }).catch(res => {
        this.toastr.error(res.message);
      });
    }
    setTimeout(() => {
      this.poll(serverProxy);
    }, 3000);
  }

  private handleCommands(commands: Command[]) {
    commands.forEach(command => {
      if (command.type === 'updateMessageList') {
        this._messages = this._messages.concat(command.data.message);
        this._messagesSubject.next(this._messages);
      }
    });
  }
}
