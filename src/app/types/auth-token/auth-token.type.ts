import {Player} from '../player/player.type';

export interface AuthToken {
    token: string;
    player: Player;
}
