export interface Command {
    type: 'login' | 'updateGameList' | 'updatePlayerList' | 'updateMessageList' | 'gameStarted' | 'updateSpread' | 'updatePlayers' |
            ':turn';
    data: any;
}
