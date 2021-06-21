import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private http:HttpClient) { }
  getPermissions(){
    return this.http.get("../../../assets/permissions.json")
  }
}
