import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { environment } from '../../../environments/environment';

import { Game, Command, User, Route, Segment, Location as MapLocation } from '../../types';
import { Message } from '../../types/message/message.type';
import { resolve, reject } from 'q';

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

  public get hasToken() {
    return this._authToken !== null;
  }

  private generateHttpOptions(): RequestOptions {
    return new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer: ${this._authToken}`
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

  public startGame(game: Game): Promise<Command[]> {
    console.log('Starting ' + game.name);
    const url = `games/${game.id}/start`;
    return this.http
      .post(`${environment.BASE_URL}/${url}`, {}, this.generateHttpOptions()).toPromise()
      .then(response => {
        return response;
      })
      .then(res => [res.json().command])
  }

  public getMapData(): Promise<{ locations: Array<MapLocation>, segments: Array<Segment> }> {
    const url = `map`;
    return this.http.get(`${environment.BASE_URL}/${url}`, this.generateHttpOptions())
      .toPromise()
      .then((response: Response) => response.json());
  }

  public getGameData(lastCommandId: number): Promise<Command[]> {
    const url = `play/${lastCommandId}`;
    return new Promise<Command[]>((resolve, reject) => {
      this.http.get(`${environment.BASE_URL}/${url}`, this.generateHttpOptions())
      .subscribe(
        (res: Response) => {
          const resJson = res.json();
          resolve(resJson.commands);
        }, err => {
          reject(err.json());
        }
      );
    })
  }

  public addMessage(chatInfo: {
    messageText: string;
    prevTimestamp: number;
  }): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http
        .post(`${environment.BASE_URL}/chat/new/${chatInfo.prevTimestamp}`, chatInfo, this.generateHttpOptions())
        .subscribe(
          (res: Response) => {
            const resJson = res.json();
            resolve(resJson.commands);
          }, err => {
            reject(err.json());
          }
        );
    });
  }

  public getUpdatedMessages(timestamp: number): Promise<Command[]> {
    return new Promise<any>((resolve, reject) => {
      this.http
        .get(`${environment.BASE_URL}/chat/${timestamp}`, this.generateHttpOptions())
        .subscribe(
          (res: Response) => {
            const resJson = res.json();
            resolve(resJson.commands);
          }, err => {
            reject(err.json());
          }
        );
    });
  }

  public selectBusCard(index: number)/*: Promise<Command[]>*/ {
    // FIXME implement
  }

  public getSpread(): Promise<Command> {
    return new Promise<any>((resolve, reject) => {
      this.http.get(`${environment.BASE_URL}/play/bus`, this.generateHttpOptions())
      .subscribe(
        (res: Response) => {
          const resJson = res.json();
          resolve(resJson.command);
        }, err => {
          reject(err.json());
        }
      );
    });
  }

  public drawRoutes(): Promise<Command[]> {
    return new Promise<any>((resolve, reject) => {
      this.http.get(`${environment.BASE_URL}/play/routes`, this.generateHttpOptions())
      .subscribe(
        (res: Response) => {
          const resJson = res.json();
          resolve(resJson.command);
        }, err => {
          reject(err.json());
        }
      );
    });
  }

  public selectRoutes(selectedRoutes: Route[], rejectedRoutes: Route[]): Promise<Command[]> {
    return new Promise<any>((resolve, reject) => {
      this.http.post(`${environment.BASE_URL}/play/routes`, {rejectedRoutes: rejectedRoutes}, this.generateHttpOptions())
      .subscribe(
        (res: Response) => {
          const resJson = res.json();
          resolve(resJson.commands);
        }, err => {
          reject(err.json());
        }
      );
    });
  }

  public claimSegment(segment: Segment) : Promise<Command[]> {
    const url: string = `${environment.BASE_URL}/segment/${segment.id}/claim`;
    return this.http.post(url, {}, this.generateHttpOptions())
      .toPromise()
      .then((response: Response) => response.json().command)
  }
}
