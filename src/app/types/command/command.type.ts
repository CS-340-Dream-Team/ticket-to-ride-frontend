export interface Command {
    type: 'login' | 'updateGameList' | 'updatePlayerList' | 'updateMessageList' | 'gameStarted' | 'updateSpread' | 'updateClientPlayer' | 'updateOpponentPlayers';
    data: any;
}
