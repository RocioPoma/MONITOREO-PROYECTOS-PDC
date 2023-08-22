import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EtapaService {
  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  //----------------------API PARA LISTAR CATEGORÍA ------------------------------
  getEtapa() {
    return this.httpClient.get(this.url + "/etapa/get/")
  }


  //----------------------API PARA EDITAR CATEGORÍA ------------------------------
  update(data: any) {
    return this.httpClient.put(this.url +
      "/etapa/update/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA ACTUALIZAR ESTADO -------------------------
  updateStatus(data: any) {
    return this.httpClient.patch(this.url +
      "/etapa/updateStatus/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
}
