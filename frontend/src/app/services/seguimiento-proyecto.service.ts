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
    return this.httpClient.get<any>(this.url + "/seguimiento_proyecto/getByIdTipologia/" + id_tipologia);
  }
  getEtapaProyectoByIdEtapa(id_proyecto:number,id_etapa:number){
    return this.httpClient.get<any>(`${this.url}/seguimiento_proyecto/getEtapaByIdEtapaProyecto`,{params:{id_proyecto,id_etapa}})
  }
  getFinanciamientoByIdEtapaProyecto(id_etapa_proyecto:number){
    return this.httpClient.get<any>(`${this.url}/seguimiento_proyecto/getFinanciamiento/${id_etapa_proyecto}`);
  }
  createSeguimientoProyecto(seguimientoForm:any){
    return this.httpClient.post<any>(`${this.url}/seguimiento_proyecto/registrarEtapa_Proyecto`,seguimientoForm)
  }
}
