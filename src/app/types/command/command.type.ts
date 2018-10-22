export interface Command {
    type: 'login' | 'updateGameList' | 'updatePlayerList' | 'updateMessageList';
    data: any;
}
