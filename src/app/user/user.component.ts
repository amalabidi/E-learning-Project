import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService} from '../services/UserService/user.service';
import { PermissionsService } from '../services/PermissionService/permissions.service'
import { ProvenanceService } from '../services/ProvenanceService/provenance.service'
import { User } from '../user/user'
import $ from 'jquery';
import { FormGroup, FormControl, FormGroupDirective, FormArray, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, AfterViewInit {
  users: User[]=[];
  nb_users:number;
  searchUser:string;
  update:boolean=false;
  user=new User
  nuser=new User
  userForm:FormGroup;
  Amenu=[];
  Adossier=[]
  AGroupe=[]
  Hab=[]
  usersName=[]
  dropdownSettings:IDropdownSettings = {};
  userid: string;
  allowedUsers: any[]=[];
  provenances:any[]=[]
  admin:any=false;
  isCoach=false
  isVender=false
  alloweduser: boolean=false;
  submitted=false
  constructor(private us:UserService,private perm:PermissionsService,private ps:ProvenanceService) { }

  ngOnInit(): void {
    this.getAuthUser()
    this.getProv()
    this.getPermissions()
    let user=new User
    this.userForm = this.createUserForm(user)
  }
  ngAfterViewInit() {
    this.createDropdown()
    this.injectStyle()
    if(!this.alloweduser){
      setTimeout(()=>this.getUsers(),1000)
    }
    else{
      this.getUsers()
    }
  }
  openModal(){
      $("#myModal").css("display", "block");
  }
  closeModal(){
    this.update=false
    this.submitted=false
    this.userForm.reset()
    $(".modal").css("display", "none");
  }
  createUserForm(user):FormGroup{

    var userForm = new FormGroup({
      name : new FormControl(user.name,Validators.required),
      lastname : new FormControl(user.lastname,Validators.required),
      password : new FormControl(''),
      provenances: new FormControl(user.provenances),
      email : new FormControl(user.email,[Validators.required,Validators.email]),
      mobile : new FormControl(user.mobile),
      company : new FormControl(user.company),
      habilitation : new FormControl(user.habilitation,Validators.required),
      permissions : new FormControl(user.permissions),
      secondaryPermissions : new FormControl(user.secondaryPermissions),
      users : new FormControl(user.users),
      authorisedConnection : new FormControl(user.authorisedConnection),
      groupedActions : new FormControl(user.groupedAction),
      tarif : new FormControl(user.tarif),
      typeTarif : new FormControl(user.typeTarif),

    })
    return(userForm)
  }
  get f() { return this.userForm.controls; }
  setUserForm(user:User){
    try{
    this.userForm.setValue({
      name: user.name,
      lastname:user.lastname,
      password:"",
      provenances:user.provenances,
      email:user.email,
      mobile:user.mobile,
      company:user.company,
      habilitation:user.habilitation,
      permissions:user.permissions,
      secondaryPermissions:user.secondaryPermissions,
      users:user.users,
      authorisedConnection:user.authorisedConnection,
      groupedActions:user.groupedAction,
      tarif:user.tarif,
      typeTarif:user.typeTarif
    })
  }
  catch(e){
  }
  }
  getProv(){
    this.ps.getProv('http://localhost:3002/provenance/etat').subscribe((data:any)=>{
      for(let d of data){
        this.provenances=this.provenances.concat(d.provenance)
      }
    })
  }
  getUsers(){
    this.us.getUser('http://localhost:3002/user').subscribe((resp:any[]) => {
      console.log(resp)
      if(this.admin){
        this.users=resp;this.nb_users=this.users.length;
        resp.forEach(r=>{
          let u = r.name+" "+r.lastname
          this.usersName=this.usersName.concat(u)
        })
      }
      else{
        resp.forEach(r=>{
          let u = r.name+" "+r.lastname
          this.allowedUsers.forEach(user=>{
            if(u==user){
              this.usersName=this.usersName.concat(u)
              this.users.unshift(r);
           }
          })
        })
        this.nb_users=this.users.length;
      }
      
      })
  }
  getAuthUser(){
    this.userid=localStorage.getItem('id')
    this.us.getUser('http://localhost:3002/user/'+this.userid).subscribe((data:any)=>{
      this.allowedUsers=data[0].users
      this.admin=data[0].admin
      this.alloweduser=true
    })
  }
  addUser(){
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
  }
  this.submitted=false
    var user=new User;
    //user.admin=true
    user.name= this.userForm.get('name').value
    user.lastname= this.userForm.get('lastname').value
    user.password= this.userForm.get('password').value
    user.email= this.userForm.get('email').value
    user.mobile= this.userForm.get('mobile').value
    user.company= this.userForm.get('company').value
    user.habilitation= this.userForm.get('habilitation').value
    user.provenances=this.userForm.get('provenances').value
    user.permissions= this.userForm.get('permissions').value
    user.secondaryPermissions= this.userForm.get('secondaryPermissions').value
    user.users= this.userForm.get('users').value
    user.authorisedConnection= this.userForm.get('authorisedConnection').value
    user.groupedAction= this.userForm.get('groupedActions').value
    user.tarif= this.userForm.get('tarif').value
    user.typeTarif= this.userForm.get('typeTarif').value
    user.provenances = this.userForm.get('provenances').value
    this.us.addUser('http://localhost:3002/user',user).subscribe((data:any)=>{this.users.unshift(data);this.nb_users=this.users.length;console.log(data)})
    this.closeModal()
  }
  getFormerUser(user:User){
    this.update = true
    this.openModal()
    this.setUserForm(user)
    this.verifCoachVen()
  }
  getUserToUpdate(user:User){
    this.user = user
  }
  updateUser(){
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
  }
  this.submitted=false
    /*this.createUserForm(this.user)*/
    let user=this.user
    user.name= this.userForm.get('name').value
    user.lastname= this.userForm.get('lastname').value
    user.password= this.userForm.get('password').value
    user.email= this.userForm.get('email').value
    user.mobile= this.userForm.get('mobile').value
    user.company= this.userForm.get('company').value
    user.habilitation= this.userForm.get('habilitation').value
    user.permissions= this.userForm.get('permissions').value
    user.secondaryPermissions= this.userForm.get('secondaryPermissions').value
    user.users= this.userForm.get('users').value
    user.authorisedConnection= this.userForm.get('authorisedConnection').value
    user.groupedAction= this.userForm.get('groupedActions').value
    user.tarif= this.userForm.get('tarif').value
    user.typeTarif= this.userForm.get('typeTarif').value    
    user.provenances = this.userForm.get('provenances').value
    this.us.updateUser('http://localhost:3002/user',user).subscribe((data:any)=>this.users[this.users.indexOf(user)]=data)
    this.update=false
    this.closeModal()
    
  }
  deleteUser(user){
    this.us.deleteUser('http://localhost:3002/user',user._id).subscribe((data:any)=>{
      this.getUsers()
    })
  }
  getPermissions(){
    this.perm.getPermissions().subscribe((data:any)=>{
      for(let m of data.menu){
        this.Amenu=this.Amenu.concat(m.permisson)
      }
      for(let d of data.dossier){
        this.Adossier=this.Adossier.concat(d.permisson)
      }
      for(let g of data.actionG){
        this.AGroupe=this.AGroupe.concat(g.permisson)
      }
      for(let h of data.habilitations){
        this.Hab=this.Hab.concat(h.permisson)
      }
    })
  }
  createDropdown(){
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: false
    };
  }
  onItemSelect(item: any) {
  }
  onSelectAll(items: any) {
  }
  injectStyle(){
    $(".dropdown-list").css("position", "absolute");
    $(".dropdown-list").css("max-height", "20rem");
    $(".dropdown-list").css("overflow-y", "scroll");
    $(".dropdown-list").css("margin-top", "2px");
    $(".selected-item").css("max-width", "max-content");
    $(".item2").css("max-height", "none");
  }
  verifCoachVen(){
    let i=$("#habilitation").val();
    if(i=="Vendeur"){
      this.isVender=true
      this.isCoach=false
    }
    else if(i=="Coachs"){
      this.isVender=false
      this.isCoach=true
    }
    else{
      this.isCoach=false
      this.isVender=false
    }
  }
  AffichageFormateDateTime(d){
    if(!d){
      return(null)
    }
    const date =new Date(d)
    return(date.toISOString().substring(0,10)+" à "+date.toISOString().substring(11,16))
  }
}
