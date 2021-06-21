import { Component, OnInit } from '@angular/core';
import { RelanceService } from '../services/RealnceService/relance.service'
import { ModeleRelanceService } from '../services/ModeleRelanceService/modele-relance.service'
import { FormGroup, FormControl, FormGroupDirective, FormArray, Validators } from '@angular/forms';
import $ from 'jquery'
@Component({
  selector: 'app-relance',
  templateUrl: './relance.component.html',
  styleUrls: ['./relance.component.css']
})
export class RelanceComponent implements OnInit {
  searchRelance
  relances=[]
  mailModel=[]
  update=false
  submitted=false
  submitted1=false
  singleRelance: any;
  constructor(private rs:RelanceService,private mrs:ModeleRelanceService) { }
  relanceForm= new FormGroup({
    nom : new FormControl('',Validators.required),
    actif : new FormControl(true),
    jour : new FormControl('',Validators.required),
    modeleMail : new FormControl(''),
    type : new FormControl('',Validators.required),

  })
  relanceMailForm=new FormGroup({
    modele: new FormControl(""),
    objet: new FormControl("",Validators.required),
    description: new FormControl("")
  })
  ngOnInit(): void {
    this.getRelance()
    this.getMrelance()
  }
  relanceModal(){
    $("#relanceModal").css("display", "block");
}
openModal(){
  $("#relanceMailModal").css("display", "block");

}
  closeModal(){
    $('.modal').css('display','none')
    this.update=false
  }
  getRelance(){
    this.rs.getRelance("http://localhost:3002/relances").subscribe((data:any)=>{
      this.relances=data
    })
  }
  getMrelance(){
    this.mrs.getMRelance("http://localhost:3002/mrelance/mail").subscribe((data:any)=>{
      console.log(data)
      data.forEach(d => {
        this.mailModel.unshift(d.modele)
      });
    })
  }
  CreateMRelance(){
    let data = {
      modele:this.relanceMailForm.get("modele").value,
      objet:this.relanceMailForm.get("objet").value,
      description:this.relanceMailForm.get("description").value,
    }
    this.mrs.addMRelance("http://localhost:3002/mrelance/mail",data).subscribe((data:any)=>{
      console.log(data)
      this.mailModel.unshift(data[0]?.modele)
    })
  }
  get f() { return this.relanceMailForm.controls; }
  get g() { return this.relanceForm.controls; }
  submitMRelance(){
    this.submitted = true;
    if (this.relanceMailForm.invalid) {
      return;
  }
  alert('Modèle Mail crée!\n\n');
    this.CreateMRelance()
  }
  createRelance(){
    let data={
      nom:this.relanceForm.get('nom').value,
      actif:this.relanceForm.get('actif').value,
      jour:this.relanceForm.get('jour').value,
      modeleMail:this.relanceForm.get('modeleMail').value,
      type:this.relanceForm.get('type').value
    }
    console.log("modele",data.modeleMail)
    this.rs.addRelance("http://localhost:3002/relances",data).subscribe((data:any)=>{
      this.relances.unshift(data)
    })
  }

  setRelanceForm(r){
    this.update=true
    this.singleRelance=r
    this.relanceForm.setValue({
      nom:r.nom,
      actif:r.actif,
      jour:r.jour,
      modeleMail:r.modeleMail,
      type:r.type
    })
  }
  updateRelance(){
    let data={
      nom:this.relanceForm.get('nom').value,
      actif:this.relanceForm.get('actif').value,
      jour:this.relanceForm.get('jour').value,
      modeleMail:this.relanceForm.get('modeleMail').value,
      type:this.relanceForm.get('type').value,
      _id:this.singleRelance._id,
    }
    this.rs.updateRelance("http://localhost:3002/relances",data).subscribe((data:any)=>{
      this.getRelance()
    })
  }
  submitRelance(){
    this.submitted1 = true;
    if (this.relanceForm.invalid) {
      return;
  }
    if(!this.update){
      this.createRelance()
      alert('Relance crée!\n\n');
    }else{
      this.updateRelance();
      alert('Relance Mis à jour!\n\n');
    }
  }

}
