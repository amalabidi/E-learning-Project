import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Formation } from '../../formation/formation';
@Injectable({
  providedIn: 'root'
})
export class FormationService {
  formation:Formation
  constructor(private http: HttpClient) { }
  getFormation(url){
      return(this.http.get(url))
  }
  addFormation(url,formation){
    return this.http.post<any>(url, formation)
  }
  updateFormation(url,formation){
    return this.http.put<any>(url,formation)
  }
  deleteFormation(url){
    return this.http.delete(url)
  }
  
}

