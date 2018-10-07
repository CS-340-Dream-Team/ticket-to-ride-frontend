export interface Command {
    type: 'login' | 'updateGameList' | 'updatePlayerList';
    data: any;
}
