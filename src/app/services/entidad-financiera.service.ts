import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntidadFinancieraService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  //----------------------API PARA LISTAR ENTIDAD FINANCIERA ------------------------------
  get() {
    return this.httpClient.get(this.url + "/entidad_financiera/get/")
  }

  //----------------------API PARA AGREGAR ENTIDAD FINANCIERA ------------------------------
  add(data: any) {
    return this.httpClient.post(this.url +
      "/entidad_financiera/create/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA EDITAR CATEGORÍA ------------------------------
  update(data: any) {
    return this.httpClient.put(this.url +
      "/entidad_financiera/update/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }


  //----------------------API PARA ELIMINAR CATEGORÍA ------------------------------
  delete(id: any) {
    return this.httpClient.delete(this.url +
      "/entidad_financiera/delete/" + id, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA ACTUALIZAR ESTADO -------------------------
  updateStatus(data: any) {
    return this.httpClient.patch(this.url +
      "/entidad_financiera/updateStatus/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }


}
