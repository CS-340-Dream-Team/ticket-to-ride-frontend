import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

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

  private generateHttpOptions(): RequestOptions {
    return new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: this._authToken
        // Authorization: 'Bearer: ' + this._authToken    // Uncomment this when the server changes
      })
    });
  }

  constructor(private http: Http) { }

  /**
   * Attempts to log a user in
   * @param credentials Username and password
   */
  public login(credentials: {
    username: string;
    password: string;
  }): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http
        .post(`${environment.BASE_URL}/login`, credentials)
        .subscribe(
          (res: Response) => {
            const resJson = res.json();
            this._authToken = resJson.token;
            resolve(resJson);
          }, err => {
            reject(err.json());
          });
    });
  }

  /**
   * Attempts to create a new user
   * @param credentials Username and password
   */
  public register(credentials: {
    username: string;
    password: string;
  }): Promise<any> {
    console.log('Making register request with URL: ' + environment.BASE_URL);
    return new Promise<any>((resolve, reject) => {
      this.http
        .post(`${environment.BASE_URL}/register`, credentials)
        .subscribe(
          (res: Response) => {
            const resJson = res.json();
            this._authToken = resJson.token;
            resolve(resJson);
          }, err => {
            reject(err.json());
          }
        );
    });
  }

  /**
   * Gets the current game list
   */
  public getUpdatedGames(): Promise<Command[]> {
    console.log('Polling');
    return new Promise<any>((resolve, reject) => {
      this.http
        .get(`${environment.BASE_URL}/games`, this.generateHttpOptions())
        .subscribe(
          (res: Response) => {
            const resJson = res.json();
            resolve([resJson.command]);
          }, err => {
            reject(err.json());
          }
        );
    });
  }

  /**
   * Attempts to create a new game
   * @param gameName Name of the GAME!
   */
  public createGame(gameName: string): Promise<Command[]> {
    console.log('Creating ' + gameName);
    const requestBody = {
      name: gameName,
      host: this._currentUser
    };

    return new Promise<any>((resolve, reject) => {
      this.http
        .post(`${environment.BASE_URL}/games`, requestBody, this.generateHttpOptions())
        .subscribe(
          (res: Response) => {
            const resJson = res.json();
            resolve([resJson.command]);
          }, err => {
            reject(err.json());
          }
        );
    });
  }

  /**
   * Attempts to add the current user to the players list of an existing game
   * @param game The game (type: Game)
   */
  public joinGame(game: Game): Promise<Command[]> {
    console.log('Joining ' + game.name);
    const url = 'games/' + game.id + '/join';
    return new Promise<any>((resolve, reject) => {
      this.http
        .post(`${environment.BASE_URL}/` + url, {}, this.generateHttpOptions())
        .subscribe(
          (res: Response) => {
            const resJson = res.json();
            resolve([resJson.command]);
          }, err => {
            reject(err.json());
          }
        );
    });
  }
}
