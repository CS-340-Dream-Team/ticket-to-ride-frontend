export interface Command {
    type: 'login' | 'updateGameList' | 'updatePlayerList' | 'updateMessageList' | 'gameStarted' | 'updateSpread' | 'updatePlayers' | 'drawRoutes' |'discardRoutes';
    data: any;
    privateData?: any;
    player?: string;
    id?: number;
}
