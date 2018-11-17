export interface Command {
    type: 'login' | 'updateGameList' | 'updatePlayerList' | 'updateMessageList' | 'gameStarted' |
          'updateSpread' | 'updatePlayers' | 'drawRoutes' |'discardRoutes' | 'incrementTurn' | 'endGame'
          | 'drawBusCard'|'drawTen';
    data: any;
    privateData?:any;
    player?:string
    id?:number
}
