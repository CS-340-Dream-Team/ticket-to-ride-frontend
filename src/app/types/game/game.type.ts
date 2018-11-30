import { Player } from "../player/player.type";

export interface Game {
	playersJoined: Player[];
	host: Player;
	name: string;
	numPlayers: number;
	id: number;
	ended: boolean;
}
