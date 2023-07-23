import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  
  //----------------------API PARA LISTAR CATEGORÍA ------------------------------
  getProyecto() {
    return this.httpClient.get(this.url + "/proyecto/get/")
  }

  //----------------------API PARA AGREGAR CATEGORÍA ------------------------------
  add(data: any) {
    return this.httpClient.post(this.url +
      "/proyecto/create/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA EDITAR CATEGORÍA ------------------------------
  update(data: any) {
    return this.httpClient.patch(this.url +
      "/municipio/update/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

 
  //----------------------API PARA ELIMINAR CATEGORÍA ------------------------------
  delete(id: any) {
    return this.httpClient.delete(this.url +
      "/municipio/delete/" + id, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA ACTUALIZAR ESTADO -------------------------
  updateStatus(data: any) {
    return this.httpClient.patch(this.url +
      "/municipio/updateStatus/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
}
