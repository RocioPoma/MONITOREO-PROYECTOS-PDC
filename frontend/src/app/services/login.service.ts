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
    this.authToken = token;
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
  ////-------------------------------------nombre y rol 



}
