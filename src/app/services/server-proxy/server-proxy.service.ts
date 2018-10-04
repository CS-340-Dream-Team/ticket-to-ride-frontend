import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { environment } from '../../../environments/environment';

import { Game, Command } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class ServerProxyService {

  private _authToken: string = null;
  private _currentUser: string = null;

  public set currentUser(userName: string) {
    this._currentUser = userName;
  }

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

  public register(credentials: { username: string, password: string }): Promise<any> {
    console.log('Making register request with URL: ' + environment.BASE_URL);
    return this.http.post(`${environment.BASE_URL}/register`, JSON.stringify(credentials))
      .toPromise();
  }

  public getUpdatedGames(): Promise<Command[]> {
    console.log('Polling');
    return this.http.get(`${environment.BASE_URL}/games`, this.httpOptions)
      .toPromise()
      .then(res => res.json().commands).catch( /* FIXME fail gracefully */);
  }

  public createGame(gameName: string): Promise<Command[]> {
    console.log('Creating ' + gameName);
    const requestBody = {
      'name': gameName,
      'host': this._currentUser
    };
    return this.http.post(`${environment.BASE_URL}/games`, requestBody, this.httpOptions)
      .toPromise()
      .then(res => res.json().commands).catch( /* FIXME fail gracefully */);
  }

  public joinGame(game: Game): Promise<Command[]> {
    console.log('Joining ' + game.name);
    const url = '/games/' + game.id + '/join';
    return this.http.post(`${environment.BASE_URL}/` + url, {}, this.httpOptions)
      .toPromise()
      .then(res => res.json().commands).catch( /* FIXME fail gracefully */);
  }
}
