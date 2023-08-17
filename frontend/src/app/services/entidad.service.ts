import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EntidadService {
  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  //----------------------API PARA LISTAR COMUNIDADES O CIUDADES DE UN MUNICIPIO -------- se utilizo 
  getEntidad(id_municipio: any) {
    return this.httpClient.get(this.url + "/comunidad/getByIdMunicipio/" + id_municipio);
  }

  GetEntidades(){
    return this.httpClient.get(this.url + "/entidad/get/");
  }

  //----------------------API PARA AGREGAR ENTIDAD EJECUTORA ------------------------------
  add(data: any) {
    return this.httpClient.post(this.url +
      "/entidad/create/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
//----------------------API PARA EDITAR CATEGORÍA ------------------------------
update(data: any) {
  return this.httpClient.put(this.url +
    "/entidad/update/", data, {
    headers: new HttpHeaders().set('Content-Type', "application/json")
  });
}


//----------------------API PARA ELIMINAR CATEGORÍA ------------------------------
delete(id: any) {
  console.log(id);
  return this.httpClient.delete(this.url +
    "/entidad/delete/" + id, {
    headers: new HttpHeaders().set('Content-Type', "application/json")
  });
}

//----------------------API PARA ACTUALIZAR ESTADO -------------------------
updateStatus(data: any) {
  return this.httpClient.patch(this.url +
    "/entidad/updateStatus/", data, {
    headers: new HttpHeaders().set('Content-Type', "application/json")
  });
}

}
