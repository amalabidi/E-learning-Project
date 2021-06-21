import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RelanceService {

  constructor(private http: HttpClient) { }
  getRelance(url){
    return(this.http.get(url))
}
  addRelance(url,type){
    return this.http.post<any>(url, type)
}
updateRelance(url,type){
  return this.http.put<any>(url,type)
}
deleteRelance(url){
  return this.http.delete(url)
}
}
