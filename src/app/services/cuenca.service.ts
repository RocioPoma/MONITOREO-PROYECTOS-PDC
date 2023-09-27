import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CuencaService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  //----------------------API PARA LISTAR CUENCA ------------------------------
  getCuenca() {
    return this.httpClient.get(this.url + "/cuenca/get/")
  }
  
}
