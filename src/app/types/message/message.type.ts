import { User } from "../user/user.type";

export interface Message {
    message: string;
    timestamp: number;
    sender: User;
}