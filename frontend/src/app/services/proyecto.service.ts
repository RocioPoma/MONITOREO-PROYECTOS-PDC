import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  
  //----------------------API PARA LISTAR PROYECTOS ------------------------------
  getProyecto() {
    return this.httpClient.get(this.url + "/proyecto/get")
  }

  //----------------------API PARA AGREGAR PROYECTO SIN DOCUMENTO ------------------------------ No se utilizo
  add(data: any) {
    return this.httpClient.post(this.url +
      "/proyecto/add/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA AGREGAR PROYECTO CON ARCHIVOS------------------------------ Este se utilizo
  add1(data: any, documento:File) {
    const fd=new FormData();
    fd.append('nom_proyecto',data.nom_proyecto);
    fd.append('fecha_inicio',data.fecha_inicio);
    fd.append('fecha_fin',data.fecha_fin);
    fd.append('fecha_registro',data.fecha_registro);
    fd.append('area',data.area);
    fd.append('coordenada_x',data.coordenada_x);
    fd.append('coordenada_y',data.coordenada_y);
    fd.append('cantidad',data.cantidad);
    fd.append('hombres',data.hombres);
    fd.append('mujeres',data.mujeres);
    fd.append('id_categoria',data.id_categoria);
    fd.append('id_tipologia',data.id_tipologia);
    fd.append('id_unidad_medicion',data.id_unidad_medicion);
    fd.append('id_indicador',data.id_indicador);
    fd.append('id_cuenca',data.id_cuenca);
    fd.append('id_accion_estrategica',data.id_accion_estrategica);
    fd.append('estado',data.estado);
    fd.append('comunidad',data.comunidad);
    fd.append("alcance",data.alcance);
    fd.append("documento",documento);

    return this.httpClient.post(this.url +
      "/proyecto/add/", fd);
  }


  //----------------------API PARA EDITAR PROYECTO ------------------------------
  update(data: any) {
    return this.httpClient.patch(this.url +
      "/municipio/update/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

 
  //----------------------API PARA ELIMINAR PROYECTO ------------------------------
  delete(id: any) {
    return this.httpClient.delete(this.url +
      "/proyecto/dele/" + id, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA ACTUALIZAR ESTADO -------------------------
  updateStatus(data: any) {
    return this.httpClient.patch(this.url +
      "/proyecto/updateStatus/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

   //----------------------API PARA LISTAR PROYECTOS ------------------------------
   getTipologia() {
    return this.httpClient.get(this.url + "/proyecto/get_tipologia")
  }

}
