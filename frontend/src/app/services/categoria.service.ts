import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  //----------------------API PARA LISTAR CATEGORÍA ------------------------------
  getCategoria() {
    return this.httpClient.get(this.url + "/categoria/get/")
  }

  //----------------------API PARA AGREGAR CATEGORÍA ------------------------------
  add(data: any) {
    return this.httpClient.post(this.url +
      "/categoria/add/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA EDITAR CATEGORÍA ------------------------------
  update(data: any) {
    return this.httpClient.patch(this.url +
      "/categoria/update/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

 
  //----------------------API PARA ELIMINAR CATEGORÍA ------------------------------
  delete(id: any) {
    return this.httpClient.delete(this.url +
      "/categoria/delete/" + id, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA ACTUALIZAR ESTADO -------------------------
  updateStatus(data: any) {
    return this.httpClient.patch(this.url +
      "/categoria/updateStatus/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
}
