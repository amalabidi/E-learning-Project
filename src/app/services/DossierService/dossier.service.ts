import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DossierService {

  constructor(private http: HttpClient) { }
  getFolder(url){
    return(this.http.get(url))
}
  addFolder(url,type){
    return this.http.post<any>(url, type)
}
updateFolder(url,type){
  return this.http.put<any>(url,type)
}
deleteFolder(url){
  return this.http.delete(url,{responseType:'text'})
}

}
