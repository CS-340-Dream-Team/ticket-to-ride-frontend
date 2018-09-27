import { Injectable } from '@angular/core';

import { Command } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class CommandManagerService {

  constructor() { }

  /**
   * Interprets and executes a series of commands.
   * @param commands The array of commands to execute.
   */
  public executeCommands(commands: Command[]) {
    for (const command of commands) {
      switch (command.type) {
        case 'login':
          break;
        case 'updateGameList':
          break;
        default:
          console.assert(false, 'command-manager.service.ts:executeCommands - Unknown command type!')
      }
    }
  }
}
