import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SignatureService {

  constructor(private htpp:HttpClient) { }
  signerDoc(url,data){
    return(this.htpp.post(url,data))
  }
  getUrl(url,data){
    return(this.htpp.post(url,data,{responseType:"text"}))
  }
  download(url){
    return(this.htpp.get(url,{responseType:"text"}))
  }
}
