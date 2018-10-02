import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServerProxyService {

  private _authToken: string = null;

  public set authToken(token: string) {
    this._authToken = token;
  }

  private readonly httpOptions = new RequestOptions({
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': this._authToken
    })
  });

  constructor(
    private http: Http
  ) {

  }

  /**
   * Attempts to log a user in
   * @param credentials Username and password
   */
  public login(credentials: { username: string, password: string }): Promise<any> {
    return this.http.post(`${environment.BASE_URL}/login`, credentials)
      .toPromise();
  }
}
