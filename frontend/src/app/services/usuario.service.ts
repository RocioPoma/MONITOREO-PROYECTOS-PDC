import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  
  //----------------------API PARA LISTAR CATEGORÍA ------------------------------
  getusuario() {
    return this.httpClient.get(this.url + "/usuarios/list")
  }

  //----------------------API PARA AGREGAR CATEGORÍA ------------------------------
  add(data: any) {
    return this.httpClient.post(this.url +
      "/usuarios/create/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA EDITAR CATEGORÍA ------------------------------
  update(data: any) {
    return this.httpClient.put(this.url +
      "/usuarios/update/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

 
  //----------------------API PARA ELIMINAR CATEGORÍA ------------------------------
  delete(id: any) {
    return this.httpClient.delete(this.url +
      "/usuarios/delete/" + id, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA ACTUALIZAR ESTADO -------------------------
  updateStatus(data: any) {
    return this.httpClient.patch(this.url +
      "/usuarios/updateStatus/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
 
}
