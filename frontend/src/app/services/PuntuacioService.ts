import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:5000/api';

@Injectable({
  providedIn: 'root'
})
export class PuntuacioService {
  constructor(private http: HttpClient) {}

  registrar(puntuacio: any): Observable<any> {
    return this.http.post(`${API_URL}/puntuacions`, puntuacio);
  }

  top5(nivell: number): Observable<any> {
    return this.http.get(`${API_URL}/puntuacions/top5/${nivell}`);
  }

  actualitzar(id: string, puntuacio: any): Observable<any> {
    return this.http.put(`${API_URL}/puntuacions/${id}`, puntuacio);
  }
}
