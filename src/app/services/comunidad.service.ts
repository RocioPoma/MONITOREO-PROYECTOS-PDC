import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComunidadService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getComunidades(){
    return this.httpClient.get(`${this.url}/comunidad/`);
  }
  GetComunidades(){
    return this.httpClient.get(this.url + "/comunidad/get");
  }

  //----------------------API PARA LISTAR COMUNIDADES O CIUDADES DE UN MUNICIPIO -------- se utilizo 
  getComunidad(id_municipio: string) {
    return this.httpClient.get(this.url + "/comunidad/getByIdMunicipio/" + id_municipio);
  }
  
  //----------------------API PARA EDITAR COMUNIDADES O CIUDADES------------------------------
  update(data: any) {
    return this.httpClient.patch(this.url +
      "/comunidad/update", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA AGREGAR COMUNIDADES O CIUDADES------------------------------
  add(data: any) {
    return this.httpClient.post(this.url +
      "/comunidad/create", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA ELIMINAR COMUNIDADES O CIUDADES ------------------------------
  delete(id: any) {
    return this.httpClient.delete(this.url + "/comunidad/delete/" + id, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA ACTUALIZAR ESTADO -------------------------
  updateStatus(data: any) {
    return this.httpClient.patch(this.url + "/comunidad/updateStatus/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

}
