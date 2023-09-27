import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FuenteInformacionService {
  url = environment.apiUrl;
  constructor(private readonly http:HttpClient) { }

  getFuentes(){
    return this.http.get<any>(`${this.url}/fuente_informacion/fuentes`)
  }
}
