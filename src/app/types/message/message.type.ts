import { Player } from "../player/player.type";

export interface Message {
    messageText: string;
    sender: Player;
    timestamp: number;
}