import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LineasEstrategicasService {

  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  //----------------------API PARA LISTAR LINEA ESTRATEICA-------- se utilizo 
  getLineasEstrategicas() {
    return this.httpClient.get(this.url + "/lineas_estr/get/");
  }

   //----------------------API PARA LISTAR LINEA DE ACCION SEGUN id_linea_estrategica -------- se utilizo 
   getLineaDeAccion(id_linea_estrategica: any) {
    return this.httpClient.get(this.url + "/lineas_acc/getByIdLineaEstrategica/" + id_linea_estrategica);
  }

  //----------------------API PARA LISTAR ACCION ESTRATEGICA SEGUN id_linea_accion -------- se utilizo 
  getAccionEstrategica(id_linea_accion: any) {
    return this.httpClient.get(this.url + "/accion_est/getByIdLineaDeAccion/" + id_linea_accion);
  }
}
