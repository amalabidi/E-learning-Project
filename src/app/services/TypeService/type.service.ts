import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class TypeService {

  constructor(private http: HttpClient) { }
  getType(url){
    return(this.http.get(url))
}
  addType(url,type){
    return this.http.post<any>(url, type)
}
updateType(url,type){
  return this.http.put<any>(url,type)
}
deleteType(url){
  return this.http.delete(url)
}
}
