import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  
  //----------------------API PARA LISTAR PROYECTOS ------------------------------
  getProyecto() {
    return this.httpClient.get(this.url + "/proyecto/get")
  }

  //----------------------API PARA AGREGAR PROYECTO ------------------------------
  add(data: any) {
    return this.httpClient.post(this.url +
      "/proyecto/add/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA EDITAR PROYECTO ------------------------------
  update(data: any) {
    return this.httpClient.patch(this.url +
      "/municipio/update/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

 
  //----------------------API PARA ELIMINAR PROYECTO ------------------------------
  delete(id: any) {
    return this.httpClient.delete(this.url +
      "/proyecto/dele/" + id, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA ACTUALIZAR ESTADO -------------------------
  updateStatus(data: any) {
    return this.httpClient.patch(this.url +
      "/proyecto/updateStatus/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

   //----------------------API PARA LISTAR PROYECTOS ------------------------------
   getTipologia() {
    return this.httpClient.get(this.url + "/proyecto/get_tipologia")
  }

}
