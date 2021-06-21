import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ExportService {
  
  constructor(private http:HttpClient) { }
  getExport(url,data){
    return(this.http.post(url,data,{ responseType: 'blob'}))
  }
}
