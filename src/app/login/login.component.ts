import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Login } from '../login/login'
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/AuthService/auth.service'
import { ConnecteduserService } from '../services/ConnectedUsers/connecteduser.service'
import $ from 'jquery'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private auth:AuthService,private cu:ConnecteduserService,public router: Router) { }
  user : any
  warning=false
  ngOnInit(): void {
    this.hide()
  }
    LoginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  })
  Login(){
    var login = new Login();
    login.email= this.LoginForm.get('email').value
    login.password = this.LoginForm.get('password').value
    this.auth.authentification("http://localhost:3002/auth",login).subscribe((data:any)=>{this.user=data;
    if(data.error){
      this.warning=true
    }else{
      this.warning=false
      setTimeout(()=>{
        this.setSession(data)
        this.router.navigate(['formation']);
        this.cu.getConnectedUser(this.user)})
    }
    
    })

  }
  setSession(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('id', data._id);
}  
  hide(){
    $(".header").css('display','none')
    $(".navigation").css('display','none')
  }

  
}
