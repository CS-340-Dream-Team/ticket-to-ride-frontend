export interface Command {
    type: 'login' | 'updateGameList' | 'updatePlayerList' | 'updateMessageList' | 'gameStarted' | 'updateSpread' | 'updatePlayers'|'initialize';
    data: any;
    id?:number;
    privateData?:Object
    player?:string
}
