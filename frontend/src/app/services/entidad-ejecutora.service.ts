import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntidadEjecutoraService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  //----------------------API PARA LISTAR ENTIDAD EJECUTORA ------------------------------
  get() {
    return this.httpClient.get(this.url + "/entidad_eje/get/")
  }

  //----------------------API PARA AGREGAR ENTIDAD EJECUTORA ------------------------------
  add(data: any) {
    return this.httpClient.post(this.url +
      "/entidad_eje/create/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

}
