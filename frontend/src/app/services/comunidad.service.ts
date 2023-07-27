import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComunidadService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  //----------------------API PARA LISTAR COMUNIDADES O CIUDADES DE UN MUNICIPIO -------- se utilizo 
  getComunidad(id_municipio: any) {
    return this.httpClient.get(this.url + "/comunidad/getByIdMunicipio/" + id_municipio);
  }

}
