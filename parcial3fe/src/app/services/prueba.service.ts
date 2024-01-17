import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Gasto } from '../interfaces/gasto';

@Injectable({
  providedIn: 'root',
})
export class PruebaService {
  constructor(private http: HttpClient) {}

  getAllPruebas(): Observable<any> {
    const url = 'http://3.79.86.124:8000/api/prueba/';
    return this.http.get<any>(url);
  }

  getPruebaInfo(idPrueba: string): Observable<any> {
    const url = 'http://3.79.86.124:8000/api/prueba/' + idPrueba + '/';
    return this.http.get<any>(url);
  }

  createPrueba(gasto: Gasto): Observable<any> {
    const url = 'http://3.79.86.124:8000/api/prueba/';
    return this.http.post<any>(url, gasto);
  }

  editPrueba(idPrueba: string, prueba: Gasto): Observable<any> {
    const url = 'http://3.79.86.124:8000/api/prueba/' + idPrueba + '/';
    return this.http.put<any>(url, prueba);
  }

  deletePrueba(idPrueba: string): Observable<any> {
    const url = 'http://3.79.86.124:8000/api/prueba/' + idPrueba + '/';
    return this.http.delete<any>(url);
  }

  buscarPorLongLat(direccion : string): Observable<any>{
    const url = 'http://3.79.86.124:8000/api/prueba/busquedaLatLot/' + direccion + '/';
    return this.http.get<any>(url);
  }

}
