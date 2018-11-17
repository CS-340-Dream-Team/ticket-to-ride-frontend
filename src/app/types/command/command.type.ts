export interface Command {
    type: 'login' | 'updateGameList' | 'updatePlayerList' | 'updateMessageList' | 'gameStarted' |
          'updateSpread' | 'drawRoutes' |'discardRoutes' | 'incrementTurn' | 'endGame'
          | 'drawBusCard';
    data: any;
    privateData?: any;
    player?: string;
    id?: number;
    message?: string;
}
