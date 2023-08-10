import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoProyectoService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  //----------------------API PARA LISTAR ETAPA SEGUN EL ID DE TIPOLOGÍA-------- se utilizo 
  getEtapaByIdTipologia(id_tipologia: any) {
    return this.httpClient.get(this.url + "/seguimiento_proyecto/getByIdTipologia/" + id_tipologia);
  }
}
