import { Component, OnInit, Input } from "@angular/core";
import { Game } from "../../types";
import { GameListManagerService } from "../../services";
import { Router } from "@angular/router";

@Component({
	selector: "app-game-list",
	templateUrl: "./game-list.component.html",
	styleUrls: ["./game-list.component.scss"],
})
export class GameListComponent implements OnInit {
	@Input() activeGames: Game[] = [];
	selectedGame: Game | null = null;
	gameStarted: boolean = false;

	constructor(private gameListManager: GameListManagerService, private router: Router) {
		gameListManager.gamesSubject.subscribe({
			next: games => (this.activeGames = games),
		});
		gameListManager.currentGameSubject.subscribe({
			next: game => (this.selectedGame = game),
		});
		gameListManager._gameStartedSubject.subscribe(started => {
			if (started == true) {
				this.router.navigateByUrl("/game-play");
			}
		});
	}

	createGameMenuOpen = false;

	ngOnInit() {}

	openCreateGameDialog() {
		this.createGameMenuOpen = true;
	}

	newGameTitle(name: string) {
		this.createGameMenuOpen = false;
		this.gameListManager.createGame(name);
	}

	closeDialog(e: Event) {
		this.createGameMenuOpen = false;
	}

	gameListEmpty(): boolean {
		return this.activeGames.length === 0;
	}

	canSelectGame(): boolean {
		return this.selectedGame == null;
	}

	select(game: Game) {
		this.gameListManager.setCurrentGame(game);
	}

	deselectGame() {
		this.select(null);
	}
}
