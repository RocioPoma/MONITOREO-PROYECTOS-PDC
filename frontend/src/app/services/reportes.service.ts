import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  url = environment.apiUrl+'/reportes';
  constructor(private readonly http:HttpClient) {}

  lineasEstrategicas(){
    return this.http.get<any>(`${this.url}/lineas-estrategicas`);
  }
  categorias(){
    return this.http.get<any>(`${this.url}/categorias`);
  }
  tipologias(){
    return this.http.get<any>(`${this.url}/tipologias`);
  }
}
