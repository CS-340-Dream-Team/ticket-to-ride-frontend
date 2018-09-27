import { Injectable } from '@angular/core';
import { ServerProxyService } from '../server-proxy/server-proxy.service';

@Injectable({
  providedIn: 'root'
})
export class AuthManagerService {

  constructor(private serverProxy: ServerProxyService) { }

  /**
  * Attempts to log a user in
  * @param credentials Username and password
  */
  public login(credentials: { username: string, password: string }) {
    return this.serverProxy.login(credentials);
  }
}
