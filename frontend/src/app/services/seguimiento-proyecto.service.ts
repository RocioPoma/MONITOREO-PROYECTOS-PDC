import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoProyectoService {
  url = environment.apiUrl+'/seguimiento_proyecto';

  constructor(private httpClient: HttpClient) { }

  //----------------------API PARA LISTAR ETAPA SEGUN EL ID DE TIPOLOGÍA-------- se utilizo 
  getEtapaByIdTipologia(id_tipologia: any) {
    return this.httpClient.get<any>(this.url + "/getByIdTipologia/" + id_tipologia);
  }
  getEtapaProyectoByIdEtapa(id_proyecto:number,id_etapa:number){
    return this.httpClient.get<any>(`${this.url}/getEtapaByIdEtapaProyecto`,{params:{id_proyecto,id_etapa}})
  }
  getFinanciamientoByIdEtapaProyecto(id_etapa_proyecto:number){
    return this.httpClient.get<any>(`${this.url}/getFinanciamiento/${id_etapa_proyecto}`);
  }
  createSeguimientoProyecto(seguimientoForm:any,files:File[]){
    console.log('los archivitos :v');
    const fd=new FormData();
    files.forEach(file=>{
      fd.append('documentos',file)
    })
    fd.append('etapa',seguimientoForm);
    // fd.append('fecha_inicio',data.fecha_inicio
    return this.httpClient.post<any>(`${this.url}/registrarEtapa_Proyecto`,fd)
  }
  registerSeguimientoEtapa(seguimientoForm:any,files:File[]){
    console.log('los archivitos :v');
    const fd=new FormData();
    files.forEach(file=>{
      fd.append('documentos',file)
    })
    const form = JSON.stringify(seguimientoForm);
    console.log('stringyfiado',form);
    fd.append('seguimiento',form);
    return this.httpClient.post(`${this.url}/registrarAvanceSeguimientoProyecto`,fd);
  }

  getEtapasProyecto(id_proyecto:number){
    return this.httpClient.get<any>(`${this.url}/getEtapasByIdProyecto/${id_proyecto}`);
  }
  getMontosEtapas(id_etapa_proyecto:number){
    return this.httpClient.get<any>(`${this.url}/getMontos/${id_etapa_proyecto}`);
  }
  getHistorialSeguimientoEtapa(id_etapa_proyecto:number){
    return this.httpClient.get<any>(`${this.url}/get_seguimientos/${id_etapa_proyecto}`);
  }
}
