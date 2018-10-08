import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Game, Player } from "../../../types";
import { GameListManagerService, AuthManagerService } from "../../../services";

@Component({
  selector: "app-lobby",
  templateUrl: "./lobby.component.html",
  styleUrls: ["./lobby.component.css"]
})
export class LobbyComponent implements OnInit {
  constructor(
    private gameListManager: GameListManagerService,
    private authManagerService: AuthManagerService
  ) {}

  @Input()
  game: Game = null;
  @Output()
  closeEvent: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {}

  getNonHostPlayers(): Player[] {
    const players = [];
    this.game.playersJoined.forEach(player => {
      if (player.name !== this.game.host.name) {
        players.push(player);
      }
    });
    return players;
  }

  closeLobby() {
    this.closeEvent.emit();
  }

  joinGame() {
    this.gameListManager.joinGame(this.game);
  }

  gameFull() {
    return this.game.playersJoined.length >= 5;
  }

  canStartGame() {
    return (
      2 <= this.game.playersJoined.length &&
      this.game.playersJoined.length <= 5 &&
      this.game.host.name === this.authManagerService.currentUser.name
    );
  }
}
