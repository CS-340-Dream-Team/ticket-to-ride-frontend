import { User } from "../user/user.type";

export interface Message {
    message: string;
    sender: User;
    timestamp: number;
}