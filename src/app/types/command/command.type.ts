export interface Command {
    type: 'login' | 'updateGameList';
    data: any;
}