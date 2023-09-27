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
//----------------------API PARA EDITAR CATEGORÍA ------------------------------
update(data: any) {
  return this.httpClient.put(this.url +
    "/entidad_eje/update/", data, {
    headers: new HttpHeaders().set('Content-Type', "application/json")
  });
}


//----------------------API PARA ELIMINAR CATEGORÍA ------------------------------
delete(id: any) {
  return this.httpClient.delete(this.url +
    "/entidad_eje/delete/" + id, {
    headers: new HttpHeaders().set('Content-Type', "application/json")
  });
}

//----------------------API PARA ACTUALIZAR ESTADO -------------------------
updateStatus(data: any) {
  return this.httpClient.patch(this.url +
    "/entidad_eje/updateStatus/", data, {
    headers: new HttpHeaders().set('Content-Type', "application/json")
  });
}

}
