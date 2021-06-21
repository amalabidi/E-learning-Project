import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CompteurService {

  constructor(private http:HttpClient) { }
  getCount(url,data){
    return(this.http.post(url,data))
  }
}
