import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class MailService {
  
  constructor(private http: HttpClient) { }
  sendMail(url,data){
    let token = localStorage.getItem('token')
    var headers_object = new HttpHeaders();
    headers_object.append('Content-Type', 'application/json');
    headers_object.append("Authorization", "Bearer " + token);
    const httpOptions = {
      headers: headers_object,
    };
    return(this.http.post(url,data,{responseType: 'text'}))
  }
}
