import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  url = environment.apiUrl+'/reportes';
  constructor(private readonly http:HttpClient) {}

  lineasEstrategicas(data:any) {
    const params = new HttpParams()
      .set('fechaInicioAnalisis', data.fechaInicioAnalisis)
      .set('fechaFinAnalisis', data.fechaFinAnalisis);
    return this.http.get<any>(`${this.url}/lineas-estrategicas`, { params });
  }

  categorias(fechaInicioAnalisis:any, fechaFinAnalisis:any) {
    const params = new HttpParams()
      .set('fechaInicioAnalisis', fechaInicioAnalisis)
      .set('fechaFinAnalisis', fechaFinAnalisis);
    return this.http.get<any>(`${this.url}/categorias`, { params });
  }
  // categorias(){
  //   return this.http.get<any>(`${this.url}/categorias`);
  // }

  tipologias(fechaInicioAnalisis:any, fechaFinAnalisis:any) {
    const params = new HttpParams()
      .set('fechaInicioAnalisis', fechaInicioAnalisis)
      .set('fechaFinAnalisis', fechaFinAnalisis);
    return this.http.get<any>(`${this.url}/tipologias`, { params });
  }
  // tipologias(){
  //   return this.http.get<any>(`${this.url}/tipologias`);
  // }

  // pdc_etapa(fechaInicioAnalisis:any, fechaFinAnalisis:any) {
  //   const params = new HttpParams()
  //     .set('fechaInicioAnalisis', fechaInicioAnalisis)
  //     .set('fechaFinAnalisis', fechaFinAnalisis);
  //   return this.http.get<any>(`${this.url}/pdc_etapa`, { params });
  // }
  pdc_etapa(){
    return this.http.get<any>(`${this.url}/pdc_etapa`);
  }

  mapa_proyecto(){
    return this.http.get<any>(`${this.url}/mapa`);
  }

  // inversion_le(fechaInicioAnalisis:any, fechaFinAnalisis:any) {
  //   const params = new HttpParams()
  //     .set('fechaInicioAnalisis', fechaInicioAnalisis)
  //     .set('fechaFinAnalisis', fechaFinAnalisis);
  //   return this.http.get<any>(`${this.url}/inversion_le`+fechaInicioAnalisis+'/'+fechaFinAnalisis);
  // }
  inversion_le(){
    return this.http.get<any>(`${this.url}/inversion_le`);
  }
  
  // inversion_desagregada_le(fechaInicioAnalisis:any, fechaFinAnalisis:any) {
  //   const params = new HttpParams()
  //     .set('fechaInicioAnalisis', fechaInicioAnalisis)
  //     .set('fechaFinAnalisis', fechaFinAnalisis);
  //   return this.http.get<any>(`${this.url}/inversion_desagregada_le`, { params });
  // }
  inversion_desagregada_le(){
    return this.http.get<any>(`${this.url}/inversion_desagregada_le`);
  }
  
  
  report_indicadores(){
    return this.http.get<any>(`${this.url}/indicadores`)
  }
}
