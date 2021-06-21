import { Component, OnInit } from '@angular/core';
import {ProvenanceService } from '../services/ProvenanceService/provenance.service'
import { Provenance } from '../provenance/provenance'
import { UserService } from '../services/UserService/user.service'
import $ from 'jquery';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-provenance',
  templateUrl: './provenance.component.html',
  styleUrls: ['./provenance.component.css']
})
export class ProvenanceComponent implements OnInit {
  provenances
  searchProv
  nb_prov
  update: boolean=false;
  provForm:FormGroup
  userid: string;
  admin: any;
  allowedProv: any;
  userName:string;
  prov: Provenance;
  nprov: Provenance=new Provenance;
  constructor(private ps:ProvenanceService,private us:UserService) { }

  ngOnInit(): void {
    this.getAuthUser();
    this.getProvenances()
    var prov=new Provenance
    this.provForm=this.createProvForm(prov)
  }
  getAuthUser(){
    this.userid=localStorage.getItem('id')
    this.us.getUser('http://localhost:3002/user/'+this.userid).subscribe((data:any)=>{
      this.allowedProv=data[0].provenances
      this.admin=data[0].admin
      this.userName=data[0].lastname
    })
  }
  createProvForm(prov):FormGroup{
    var provForm = new FormGroup({
      provenance : new FormControl(prov.provenance),
      actif : new FormControl(prov.actif),})
      return(provForm)
    }
    setProvForm(prov:Provenance){
      this.provForm.setValue({
        provenance: prov.provenance,
        actif:prov.actif,
      })
    }
  getProvenances(){
    this.ps.getProv('http://localhost:3002/provenance').subscribe((data:any)=>{
      this.provenances=data;this.nb_prov=this.provenances.length
    })
  }
  addProvenance(){
    let prov=new Provenance
    prov.provenance=this.provForm.get('provenance').value
    prov.actif=this.provForm.get('actif').value
    prov.user=this.userName
    prov.creationDate=new Date()
    this.ps.addProv('http://localhost:3002/provenance',prov).subscribe((data:any)=>{
      this.provenances.unshift(data);this.nb_prov=this.provenances.length
    })
  }
  getFormerProv(prov:Provenance){
    this.update = true
    this.openModal()
    this.setProvForm(prov)
  }
  getProvToUpdate(prov:Provenance){
    this.prov = prov
  }
  updateProv(){
    let prov = this.prov
    prov.provenance=this.provForm.get('provenance').value
    prov.actif=this.provForm.get('actif').value
    this.ps.updateProv('http://localhost:3002/provenance',prov).subscribe((data:any)=>{
      this.provenances[this.provenances.indexOf(prov)]=data
    })
    this.update=false
  }
  deleteProv(prov){
    this.ps.deleteProv('http://localhost:3002/provenance',prov._id).subscribe((data:any)=>{
      this.getProvenances()
    })
  }
  openModal(){
    /*var formation = new Formation
    this.formationForm = this.CreateFormationForm(formation)*/
    $(".modal").css("display", "block");
  }
  closeModal(){
    this.update=false
    this.setProvForm(this.nprov)
    $(".modal").css("display", "none");
  }
  AffichageFormateDateTime(d){
    const date =new Date(d)
    return(date.toISOString().substring(0,10)+" à "+date.toISOString().substring(11,16))
  }
  getStatus(i){
    return($('input[name=status'+i+']').prop('checked'));
  }
  updateStatus(p,i){
    p.actif=this.getStatus(i)
    this.ps.updateProv('http://localhost:3002/provenance',p).subscribe((data:any)=>{
      this.provenances[this.provenances.indexOf(p)]=data
    })
  }
}
