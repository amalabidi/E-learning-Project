import { Component, OnInit, AfterViewInit,Input } from '@angular/core';
import { UserService } from '../services/UserService/user.service'
import { PermissionsService } from '../services/PermissionService/permissions.service'
import { Router } from '@angular/router'
import $ from 'jquery'
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit,AfterViewInit {
  userid
  permissions=[]
  Amenu:any[]=[]
  userloaded=false
  constructor(private router:Router,private us:UserService,private perm:PermissionsService) { }

   ngOnInit(): void { 
     this.hide()
  }
  async ngAfterViewInit(){
    let data = await this.getUser()
    this.permissions=data[0]?.permissions
    this.getMenu()
    setTimeout(()=>{
      this.checkroute()
    },300)
    
  }
  getUser(){
    this.userid=localStorage.getItem('id')
    return(this.us.getUser('http://localhost:3002/user/'+this.userid).toPromise())
  }
  getMenu(){
    this.perm.getPermissions().subscribe((data:any)=>{
        for(let m of data.menu){
          this.Amenu=this.Amenu.concat(m)
        };
        this.setAcces()
    })
  }
  setAcces(){
    this.permissions.forEach(p=>{
      for(let a of this.Amenu){
        if(p==a.permisson){
          a.acces=true;
          break;
        }
      }
    })
  }

  Logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("id");
}
checkroute(){
  if(this.router.url==='/dossier'){
    this.getEvent(1)
  }
  if(this.router.url==='/tableau-de-bord'){
    this.getEvent(0)
  }
  if(this.router.url==='/planning'){
    this.getEvent(2)
  }
  if(this.router.url==='/provenance'){
    this.getEvent(3)
  }
  if(this.router.url==='/suivi-modification'){
    this.getEvent(4)
  }
  if(this.router.url==='/utilisateur'){
    this.getEvent(5)
  }  
  if(this.router.url==='/formation'){
    this.getEvent(6)
  }
  if(this.router.url==='/bpf'){
    this.getEvent(7)
  }
  if(this.router.url==='/couts'){
    this.getEvent(8)
  }
  if(this.router.url==='/import-leads'){
    this.getEvent(9)
  }
  if(this.router.url==='/import-ipbx'){
    this.getEvent(10)
  }
  if(this.router.url==='/compteur'){
    this.getEvent(11)
  }
  if(this.router.url==='/relance'){
    this.getEvent(13)
  }
  if(this.router.url==='/parametre'){
    this.getEvent(12)
  }
}
getEvent(id){
  for(let i=0;i<14;i++){
    $("#"+(i)).attr('class','material-icons')
  }
  $("#"+(id)).attr('class','material-icons actif')
}
hide(){
  if(this.router.url==="/login"){
    $('.main-menu').css('display','none')
  }
  else{
    $('.main-menu').css('display','blcok')
  }
}

}
