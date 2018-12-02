import { User } from "../user/user.type";

export interface AuthToken {
	token: string;
	player: User;
}
