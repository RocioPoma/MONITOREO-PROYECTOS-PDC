import { HttpClient } from '@angular/common/http';
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
}
