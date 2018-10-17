import { Player } from "../player/player.type";

export interface Message {
    message: string;
    timestamp: number;
    sender: Player;
}