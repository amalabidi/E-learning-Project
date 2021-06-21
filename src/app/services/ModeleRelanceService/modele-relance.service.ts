import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ModeleRelanceService {

  constructor(private http:HttpClient) { }
  getMRelance(url){
    return(this.http.get(url))
}
  addMRelance(url,type){
    return this.http.post<any>(url, type)
}
updateMRelance(url,type){
  return this.http.put<any>(url,type)
}
deleteMRelance(url){
  return this.http.delete(url)
}
}
