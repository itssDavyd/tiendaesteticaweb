import {HttpHeaders, HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {GLOBAL} from "./global";
import axios, {AxiosResponse, AxiosError} from 'axios';

@Injectable()
export class CitasService {
  public url: string;

  constructor(
    public _http: HttpClient
  ) {
    this.url = GLOBAL.url;
  }

  index(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'citas', {headers: headers});
  }

  getEstados(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'estados', {headers: headers});
  }

  store(cita: any): Observable<any> {
    const data = new FormData();
    // data.append('email', cita.email);
    data.append('telefono', cita.telefono);
    data.append('nombre', cita.nombre);
    data.append('apellidos', (cita.apellidos == "") ? "" : cita.apellidos);
    data.append('fecha', cita.fecha);
    data.append('hora', cita.hora);
    data.append('id_estado', "10");
    return this._http.post<any>(this.url + 'citas', data);
  }

  update(estado: any, id: number): Observable<any> {
    const data = {id_estado: estado};
    return this._http.put(this.url + 'citas/' + id, data);
  }

  cleanCitas(): Observable<any> {
    return this._http.get(this.url + 'cleanCitas');
  }
}
