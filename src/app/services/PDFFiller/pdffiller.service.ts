import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PdffillerService {

  constructor(private http:HttpClient) { }
  fillPdf(url,data){
    return(this.http.post(url,data,{responseType:'text'}))
  }
  getPdf(url){
    return(this.http.get(url,{ responseType: 'blob'}))
  }
}
