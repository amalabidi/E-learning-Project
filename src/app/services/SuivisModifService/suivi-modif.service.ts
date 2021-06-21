import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SuiviModifService {

  constructor(private http:HttpClient) { }
  getModif(url){
    return(this.http.get(url))
  }
}
