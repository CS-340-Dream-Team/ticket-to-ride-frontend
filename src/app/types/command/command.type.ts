export interface Command {
	type:
		| "login"
		| "updateGameList"
		| "updatePlayerList"
		| "updateMessageList"
		| "gameStarted"
		| "updateSpread"
		| "drawRoutes"
		| "discardRoutes"
		| "incrementTurn"
		| "endGame"
		| "drawBusCard"
		| "drawTen"
		| "showError"
		| "claimSegment";
	data: any;
	privateData?: any;
	player?: string;
	id?: number;
	message?: string;
}
