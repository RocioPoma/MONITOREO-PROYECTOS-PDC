import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IndicadorService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  //----------------------API PARA LISTAR INDICADOR-------- se utilizo
  getIndicador() {
    return this.httpClient.get(this.url + "/indicador/get/");
  }

  //----------------------API PARA EDITAR CATEGORÍA ------------------------------
  updateIndicador(data: any) {
    return this.httpClient.put(this.url +
      "/indicador/update/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA ACTUALIZAR CATEGORÍA ------------------------------
  updateStatus(data: any){
    return this.httpClient.patch(this.url +
      "/indicador/habilitarDeshabilitar/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
}
