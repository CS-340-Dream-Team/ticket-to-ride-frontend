import { Component, OnInit } from "@angular/core";
import { GameOverStat } from "src/app/types/game-over-stat/GameOverStat";
import { GamePlayManagerService, GameListManagerService } from "src/app/services";
import { Router } from "@angular/router";
import { ChatManagerService } from "../../../services/chat-manager/chat-manager.service";

@Component({
	selector: "app-game-over",
	templateUrl: "./game-over.component.html",
	styleUrls: ["./game-over.component.scss"],
})
export class GameOverComponent implements OnInit {
	_stats: GameOverStat[] = [];

	constructor(
		private gamePlayManagerService: GamePlayManagerService,
		private router: Router,
		private glms: GameListManagerService,
		private cms: ChatManagerService
	) {
		gamePlayManagerService.gameOverStatsSubject.subscribe({
			next: stats => (this._stats = stats),
		});
	}

	ngOnInit() {}

	_exit(): void {
		this.router.navigate(["/game-list"]);
		this.glms.setCurrentGame(null);
		this.cms.stopPolling();
		this.glms.startPolling();
	}
}
