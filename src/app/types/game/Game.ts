import {Player} from '../player/Player';

export class Game {
    constructor(host: Player, name: string) {
        this.numPlayers = 1;
        this.name = name;
        this.host = host;
        this.playersJoined.push(host);
    }

    playersJoined: Array<Player> = [];
    host: Player;
    name: string;
    numPlayers: number;
    id: number;

    addPlayer(player: Player) {
        if (!this.playersJoined.includes(player)) {
            this.playersJoined.push(player);
            this.numPlayers++;
        }
    }
}
