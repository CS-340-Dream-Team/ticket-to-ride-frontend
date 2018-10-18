import { Injectable } from "@angular/core";
import { ServerProxyService } from "../server-proxy/server-proxy.service";
import { User } from "../../types";

@Injectable({
  providedIn: "root"
})
export class AuthManagerService {
  private _currentUser: User;

  public get currentUser() {
    return this._currentUser;
  }

  constructor(private serverProxy: ServerProxyService) {}

  /**
   * Attempts to log a user in
   * @param credentials Username and password
   */
  public login(credentials: { username: string; password: string }) {
    return this.serverProxy.login(credentials).then(() => {
      this._currentUser = { name: credentials.username } as User;
    });
  }
  public register(credentials: { username: string; password: string }) {
    return this.serverProxy.register(credentials).then(() => {
      this._currentUser = { name: credentials.username } as User;
    });
  }
}
