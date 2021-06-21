import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SuiviModifService } from '../services/SuivisModifService/suivi-modif.service'
import { UserService } from '../services/UserService/user.service'
import { DossierService } from '../services/DossierService/dossier.service'
import $ from 'jquery';
@Component({
  selector: 'app-suivi-modif',
  templateUrl: './suivi-modif.component.html',
  styleUrls: ['./suivi-modif.component.css']
})
export class SuiviModifComponent implements OnInit,AfterViewInit {
  searchModif
  modif
  nb_modif
  clients=[]
  users=[]
  data=[]
  key: string = 'name'; //set default
  reverse: boolean = false;
  sort(key){
    this.key = key;
    this.reverse = !this.reverse;
  }
  p: number = 1;
  constructor(
    private sm:SuiviModifService,
    private ds:DossierService,
    private us:UserService
    ) { }
  ngOnInit(): void {
    //this.getModif()
  }
  async ngAfterViewInit(){
    this.modif=await this.getModif()
    this.modif.forEach(modif=>{
    this.getALldata(modif)
    })
    this.injectPaginationStyle()
    console.log(this.data)
  }
  getModif(){
    return(this.sm.getModif("http://localhost:3002/modifications").toPromise())
    /*.subscribe((resp:any)=>{
      resp.forEach(modif=>{
        this.modif=this.modif.concat(modif)
        this.getClients(modif.client)
        this.getUser(modif.user)
      })
    })*/
  }
  getClients(id){
    return(this.ds.getFolder('http://localhost:3002/dossier/client/'+id).toPromise())
    /*.subscribe((resp:any)=>{
        this.clients=this.clients.concat(resp)
    })*/
  }
  getUser(id){
    return(this.us.getUser('http://localhost:3002/user/'+id).toPromise())
    /*.subscribe((resp:any)=>{
    this.users=this.users.concat(resp)
    })*/
  }
  async getALldata(modif){
    
    let client = await this.getClients(modif.client)
    //let user = await this.getUser(modif.user)
    let data={
      modif:modif,
      client:client,
      user:modif.user,
    }
    this.data.unshift(data)
  }
  AffichageFormateDateTime(d){
    const date =new Date(d)
    return(date.toISOString().substring(0,10)+" à "+date.toISOString().substring(11,16))
  }
  injectPaginationStyle(){
    $('.ngx-pagination').css("width","max-content")
    $('.ngx-pagination').css("float","right")
    //$('.ngx-pagination li').attr('style','  width: 6.277vw;height: 2.263vw;margin: 1.752vw 0.657vw 4.38vw 5.182vw;padding: 0.511vw 1.168vw 0.584vw;border-radius: 4px;border: solid 1px #f5f5f5;background-color: #ffffff;')
    $('.ngx-pagination .current').toggleClass('changed')
    $('.pagination-next ::after').css('display','none')
  }
}
