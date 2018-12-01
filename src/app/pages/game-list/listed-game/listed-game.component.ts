import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Game } from "../../../types";
import { GameListManagerService } from "../../../services";

@Component({
	selector: "app-listed-game",
	templateUrl: "./listed-game.component.html",
	styleUrls: ["./listed-game.component.scss"],
})
export class ListedGameComponent implements OnInit {
	@Input() game: Game;
	@Input() canClick: boolean;
	@Output() selectEvent: EventEmitter<null> = new EventEmitter<null>();

	constructor(private gameListManager: GameListManagerService) {}

	ngOnInit() {}

	getRemaining() {
		return 5 - this.game.numPlayers;
	}

	selectGame() {
		this.selectEvent.emit();
	}

	disableButton() {
		return !this.canClick;
	}
}
