export interface Command {
    type: 'login' | 'updateGameList' | 'updatePlayerList' | 'updateMessageList' | 'gameStarted' |
          'updateSpread' | 'updatePlayers' | 'drawRoutes' |'discardRoutes' | 'incrementTurn';
    data: any;
    privateData?: any;
    player?: string;
    id?: number;
    message?: string;
}
