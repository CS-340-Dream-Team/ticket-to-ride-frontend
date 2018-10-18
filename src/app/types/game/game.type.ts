import {User} from '../user/user.type';

export interface Game {
    playersJoined: User[];
    host: User;
    name: string;
    numPlayers: number;
    id: number;
}
