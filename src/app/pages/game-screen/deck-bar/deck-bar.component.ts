import { Component, OnInit } from "@angular/core";
import { BusCard, BusColor } from "../../../types";
import { GamePlayManagerService } from "../../../services";

@Component({
	selector: "app-deck-bar",
	templateUrl: "./deck-bar.component.html",
	styleUrls: ["./deck-bar.component.scss"],
})
export class DeckBarComponent implements OnInit {
	public spread: BusCard[];
	public numBuses: number;
	public numRoutes = 28;

	constructor(private gamePlayManager: GamePlayManagerService) {
		gamePlayManager.spreadSubject.subscribe({
			next: spread => (this.spread = spread),
		});
		gamePlayManager.deckSizeSubject.subscribe({
			next: deckSize => (this.numBuses = deckSize),
		});
		gamePlayManager.getSpread().then(spread => {
			this.spread = spread;
		});
		gamePlayManager.routeDeckSizeSubject.subscribe({
			next: numRoutes => (this.numRoutes = numRoutes),
		});
	}

	ngOnInit() {}

	getColorClass(card: BusCard) {
		return "card-color-" + BusColor[card.color].toLowerCase();
	}

	selectBusCard(index: number) {
		this.gamePlayManager.trySelectBusCard(index);
	}

	isPlayerTurn() {
		if (this.gamePlayManager.clientPlayer) {
			return this.gamePlayManager.clientPlayer.name === this.gamePlayManager.playerTurn;
		}
	}

	selectRouteCards() {
		this.gamePlayManager.tryDrawRoutes();
	}
}
