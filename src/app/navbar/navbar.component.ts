import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/UserService/user.service'
import { SettingService } from '../services/SettingsService/setting.service'
import { User } from '../user/user'
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userid
  lastname
  settings
  logo
  siret: any;
  region: any;
  constructor(private us:UserService,private ss:SettingService) { }

  ngOnInit(): void {
    this.getUser()
    this.getSetting()
  }
  getUser(){
    this.userid=localStorage.getItem('id')
    this.us.getUser('http://localhost:3002/user/'+this.userid).subscribe((data:any)=>{
      this.lastname=data[0]?.lastname+" "+data[0]?.name
    })
  }
  getSetting(){
    this.ss.getSetting('http://localhost:3002/parameters/').subscribe((data:any)=>{
      this.settings=data
      this.logo=this.settings[0]?.logo
      this.siret=this.settings[0]?.siret
      this.region=this.settings[0]?.region
    })
  }
  Logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("id");
}

}
