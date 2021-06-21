import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  getUser(url){
    return(this.http.get(url))
}
  addUser(url,user){
    return this.http.post<any>(url, user)
}
updateUser(url,type){
  return this.http.put<any>(url,type)
}
deleteUser(url,id){
  return this.http.delete(url+'/'+id,{responseType:"text"})
}
}
