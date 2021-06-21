import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnecteduserService {
  user:any;
  constructor() { }
  getConnectedUser(user){
    this.user=user
  }
  sendConnectedUser(){
    
  }
}
