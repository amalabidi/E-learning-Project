import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private http:HttpClient) { }
  getSetting(url){
    return(this.http.get(url))
}
  addSetting(url,setting){
    return this.http.post<any>(url, setting)
}
updateSetting(url,setting){
  return this.http.put<any>(url,setting)
}
deleteSetting(url){
  return this.http.delete(url)
}
}
