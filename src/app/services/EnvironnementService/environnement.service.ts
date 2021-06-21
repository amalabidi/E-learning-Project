import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class EnvironnementService {

  constructor(private http: HttpClient) { 
    
  }
  getEnvironnement(url){
    return(this.http.get(url))
}
  addEnvironnement(url,type){
  return this.http.post<any>(url, type)
}
deleteEnv(url){
  return this.http.delete(url)
}
}
