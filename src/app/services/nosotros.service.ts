import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class NosotrosService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }


  //----------------------API PARA LISTAR archivos------------------------------
  getNosotros() {
    return this.httpClient.get(this.url + "/nosotros/listar")
  }
  //----------------------API PARA LISTAR archivos------------------------------
  AddNosotros(file: FormData) {
    return this.httpClient.post(this.url + "/nosotros/add",file)
  }

  upload(file: FormData){
    return this.httpClient.put(this.url+"/nosotros/update",file);
  }


}
