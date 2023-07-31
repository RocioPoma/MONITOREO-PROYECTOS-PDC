import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LineasEstrategicasService {

  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  //----------------------API PARA LISTAR COMUNIDADES O CIUDADES DE UN MUNICIPIO -------- se utilizo 
  getLineasEstrategicas() {
    return this.httpClient.get(this.url + "/lineas_estr/get/");
  }

}
