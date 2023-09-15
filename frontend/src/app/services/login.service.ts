import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private rol: string ="";
  private nombre: string="";
  private ap: string="";
  private am: string="";
  private entidad: string="";
  private estado: string="";
  private ci: string="";
  url = environment.apiUrl;
  private authToken: string | null = null;



  constructor(private http: HttpClient) { 
    // Recuperar datos del almacenamiento local si están disponibles
  }


  login(email: string, password: string) {
    // Realiza una solicitud POST al servidor para obtener el token de autenticación
    const credentials = { email, password };
    return this.http.post<any>(this.url+"/usuarios/login", credentials);  
  }
 
  setAuthToken(token: string): void {
    //console.log(token);
    localStorage.setItem('token', token);
    this.authToken = localStorage.getItem('token');
   
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  //--------------------salir de usaurio-
  logout() {
    // Eliminar el token almacenado
    localStorage.removeItem('token');
    
  }

  ////-------------------------------------nombre y rol 
  
  setRol(rol: string) {
    this.rol = rol;
      // Guardar en el almacenamiento local
      localStorage.setItem('rol', rol);
  }

  getRol() {
    return this.rol;
  }

  setNombre(nombre: string) {
    this.nombre = nombre;
     // Guardar en el almacenamiento local
     localStorage.setItem('nombre', nombre);
  }

  getNombre() {
    return this.nombre;
  }

  setAp(ap: string) {
    this.ap = ap;
     // Guardar en el almacenamiento local
     localStorage.setItem('ap_paterno', ap);
  }

  getAp() {
    return this.ap;
  }

  setAm(am: string) {
    this.am = am;
     // Guardar en el almacenamiento local
     localStorage.setItem('ap_materno', am);
  }

  getAm() {
    return this.am;
  }
  //entidad
  setEntidad(entidad: string) {
    this.entidad = entidad;
      // Guardar en el almacenamiento local
      localStorage.setItem('entidad', entidad);
  }

  getEntidad() {
    return this.entidad;
  }

  //estado
  setEstado(Estado: string) {
    this.estado = Estado;
      // Guardar en el almacenamiento local
      localStorage.setItem('estado', Estado);
  }

  getEstado() {
    return this.estado;
  }

  setCi(ci: string) {
    this.ci = ci;
      // Guardar en el almacenamiento local
      localStorage.setItem('ci', ci);
  }

  getCi() {
    return this.ci;
  }

  ////-------------------------------------nombre y rol 



}
