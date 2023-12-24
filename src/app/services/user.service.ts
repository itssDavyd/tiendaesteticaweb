import {Injectable} from "@angular/core";
import {HttpHeaders, HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {GLOBAL} from "./global";
import {User} from "../models/user";

@Injectable()
export class UserService {
  public url: string;
  public identity: any;
  public token: any

  constructor(
    public _http: HttpClient
  ) {
    this.url = GLOBAL.url;
  }

  login(user: any): Observable<any> {
    const data = new FormData();
    data.append('email', user.email);
    data.append('password', user.password);
    return this._http.post<any>(this.url + 'login', data);
  }

  getIdentity() {
    let identity = JSON.parse(<string>localStorage.getItem('identity'));
    if (identity != "undefined") {
      this.identity = identity;
    } else {
      this.identity = null;
    }
    return this.identity;
  }

  getToken() {
    let token = JSON.parse(<string>localStorage.getItem('token'));
    if (token != "undefined") {
      this.token = token;
    } else {
      this.token = null;
    }
    return this.token;
  }
}
