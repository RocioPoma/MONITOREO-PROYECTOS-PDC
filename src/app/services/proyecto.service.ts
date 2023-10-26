import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  //----------------------API PARA LISTAR PROYECTOS ------------------------------
  getProyecto2(ci: string) {
    return this.httpClient.get(this.url + "/proyecto//buscar/"+ ci)
  }

  //----------------------API PARA AGREGAR PROYECTO SIN DOCUMENTO ------------------------------ No se utilizo
  add(data: any) {
    return this.httpClient.post(this.url +
      "/proyecto/add/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA AGREGAR PROYECTO CON ARCHIVOS------------------------------ Se utilizo
  add1(data: any, documento: File) {
    const fd = new FormData();
    fd.append('nom_proyecto', data.nom_proyecto);
    fd.append('fecha_inicio', data.fecha_inicio);
    fd.append('fecha_fin', data.fecha_fin);
    fd.append('fecha_registro', data.fecha_registro);
    fd.append('area', data.area);
    fd.append('coordenada_x', data.coordenada_x);
    fd.append('coordenada_y', data.coordenada_y);
    fd.append('id_categoria', data.id_categoria);
    fd.append('id_tipologia', data.id_tipologia);
    fd.append('id_indicador', data.id_indicador);
    fd.append('id_cuenca', data.id_cuenca);
    fd.append('id_accion_estrategica', data.id_accion_estrategica);
    fd.append('estado', data.estado);
    fd.append('comunidad', data.comunidad);
    fd.append("alcance", data.alcance);
    fd.append("documento", documento);
    fd.append("ci", data.ci);

    return this.httpClient.post(this.url +
      "/proyecto/add/", fd);
  }


  //----------------------API PARA EDITAR PROYECTO ------------------------------  // Se utilizo
  update(data: any, documento: File) {
    const fd = new FormData();
    fd.append('id_proyecto', data.id_proyecto);
    fd.append('nom_proyecto', data.nom_proyecto);
    fd.append('fecha_inicio', data.fecha_inicio);
    fd.append('fecha_fin', data.fecha_fin);
    fd.append('fecha_registro', data.fecha_registro);
    fd.append('area', data.area);
    fd.append('coordenada_x', data.coordenada_x);
    fd.append('coordenada_y', data.coordenada_y);
    fd.append('id_categoria', data.id_categoria);
    fd.append('id_tipologia', data.id_tipologia);
    fd.append('id_indicador', data.id_indicador);
    fd.append('id_cuenca', data.id_cuenca);
    fd.append('id_accion_estrategica', data.id_accion_estrategica);
    fd.append('estado', data.estado);
    fd.append('comunidad', data.comunidad);
    fd.append("alcance", data.alcance);
    fd.append("nombre_documento", data.nombre_documento);
    fd.append("documento", documento);


    return this.httpClient.patch(this.url +
      "/proyecto/update/", fd);
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
  
  //-------------------------añadir archivos--------------------------------------
  addA(documento: FormData) {
    return this.httpClient.post(this.url +
      "/proyecto/addDocs/", documento);
  }

  //-------------------forma2--------------------------
  uploadFiles(files: File[], comentario:any, id_proyecto:any) {   
    const formData = new FormData();
    formData.append('comentario', comentario);
    formData.append('id_proyecto', id_proyecto);
     for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].name);
      console.log(files[i].name);
    } 
    
    return this.httpClient.post<any>(this.url+"/proyecto/upload/", formData);
  }



  //-------------------------listar--------------------------------------
  getDoc(id_proyecto: string) {
    return this.httpClient.get(this.url + "/proyecto/listarDoc/"+ id_proyecto)
  }


    //----------------------API PARA ELIMINAR Documentos ------------------------------
    delete2(id: any,nombre:any) {
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body: { nombre: nombre }, // Aquí pasas el nombre en el cuerpo
      };
    
      // Realiza una solicitud HTTP DELETE con un cuerpo que incluye el nombre
      return this.httpClient.delete(this.url+"/proyecto/delete2/"+id, options)
       
    }

     //----------------------API PARA DESCAGAR Documentos ------------------------------
     downloadFile(filename: string): Observable<Blob> {
      const url = (this.url+ '/proyecto/download/'+filename);
      return this.httpClient.get(url, { responseType: 'blob' });
    }
  
}
