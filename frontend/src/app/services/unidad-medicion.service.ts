import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnidadMedicionService {

  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  //----------------------API PARA LISTAR UNIDAD MEDICION------------------------------
  getUnidad() {
    return this.httpClient.get(this.url + "/unidad/get/")
  }
}
