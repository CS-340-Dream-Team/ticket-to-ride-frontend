import { Player } from "../player/player.type";

export interface Message {
    message: string;
    sender: Player;
    timestamp: number;
}