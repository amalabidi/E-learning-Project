import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CoutsService {

  constructor(private http:HttpClient) { }
  getCout(url){
    return(this.http.get(url))
  }
}
