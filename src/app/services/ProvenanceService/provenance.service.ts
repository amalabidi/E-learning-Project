import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ProvenanceService {

  constructor(private http: HttpClient) { }
  getProv(url){
    return(this.http.get(url))
}
  addProv(url,type){
    return this.http.post<any>(url, type)
}
updateProv(url,type){
  return this.http.put<any>(url,type)
}
deleteProv(url,id){
  return this.http.delete(url+'/'+id,{responseType:"text"})
}
}