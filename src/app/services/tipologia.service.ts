import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TipologiaService {

  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  //----------------------API PARA LISTAR CATEGORÍA ------------------------------
  geTipologia() {
    return this.httpClient.get(this.url + "/tipologia/get")
  }


}
