import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Game, User } from "../../../types";
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

  getNonHostPlayers(): User[] {
    const players = [];
    this.game.playersJoined.forEach(player => {
      if (player.name !== this.game.host.name) {
        players.push(player);
      }
    });
    return players;
  }

  canStartGame() {
    return (
      2 <= this.game.playersJoined.length &&
      this.game.playersJoined.length <= 5 &&
      this.game.host.name === this.authManagerService.currentUser.name
    );
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

  startGame() {
    if (!this.canStartGame()) {
      throw Error("User is not permitted to start the game");
    }
    this.gameListManager.startGame(this.game);
  }
}
