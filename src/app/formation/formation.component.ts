import { Component, OnInit, AfterViewInit } from '@angular/core';
import $ from 'jquery';
import { FormGroup, FormControl, FormGroupDirective, FormArray, Validators } from '@angular/forms';
import {FormationService} from '../services/FormationService/formation.service';
import {TypeService} from '../services/TypeService/type.service';
import {EnvironnementService} from '../services/EnvironnementService/environnement.service';
import {Formation} from '../formation/formation';
import {Type} from '../formation/type';
import {Environnement} from '../formation/environnement'

@Component({
  selector: 'app-formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.css']
})
export class FormationComponent implements OnInit, AfterViewInit {
  type:string ="---"
  clicked:boolean=true
  formation:Formation
  formations : Formation[]
  typesActives : Type[]
  types : Type []
  nb_type: number;
  nb_env: number;
  nb_formations: number;
  environments : Environnement []
  environmentActive :Environnement []
  formationForm: FormGroup
  typeForm : FormGroup
  envForm : FormGroup
  update : boolean = false
  searchFormation;
  searchType;
  searchEnv;
  date : Date
  submitted=false
  constructor(private fs:FormationService,private ts:TypeService,private es:EnvironnementService) { }
  ngAfterViewInit(): void {
    this.showBar()
  }
  ngOnInit(): void {
    this.getFormation()
    this.getType()
    this.getTypeActive()
    this.getEnvironnement()
    this.getEnvironnementActive()
    var formation = new Formation
    this.formationForm = this.CreateFormationForm(formation)
    var type = new Type
    this.typeForm = this.CreateTypeForm(type)
    var env = new Environnement
    this.envForm = this.CreateEnvironmentForm(env)
  }
  CreateFormationForm(formation):FormGroup{
    var formationForm = new FormGroup({
      coutCertification: new FormControl(formation.CoutCertification),
      prestataireCertification: new FormControl(formation.prestataireCertification),
      intituleCertification: new FormControl(formation.intituleCertification),
      UrlCertification: new FormControl(formation.UrlCertification),
      modalitePedagogique: new FormControl(formation.modalitePedagogique),
      type: new FormControl(formation.type,Validators.required),
      environment: new FormControl(formation.environment,Validators.required),
      Duree: new FormControl(formation.Duree),
      intitule: new FormControl(formation.intitule),
      designation: new FormControl(formation.designation),
      referance: new FormControl(formation.referance),
      nombre_Heures: new FormControl(formation.nombre_Heures),
      tarif: new FormControl(formation.tarif),
      code_BFP: new FormControl(formation.code_BFP),
      Url_formation: new FormControl(formation.Url_formation),
      prestataire_Elearning: new FormControl(formation.prestataire_Elearning),
      cout_Elearning: new FormControl(formation.cout_Elearning),
      etat: new FormControl(formation.etat),
      Objectifs: new FormControl(formation.Objectifs),
      Prerequis: new FormControl(formation.Prerequis),
      resultats_attendus: new FormControl(formation.resultats_attendus),
      public: new FormControl(formation.public),
      contenu: new FormControl(formation.contenu),
      certification: new FormControl(formation.certification),
    })
    return(formationForm)
  }
  CreateTypeForm(type:Type):FormGroup{
    var typeForm = new FormGroup({
      type: new FormControl(type.type),
      actif: new FormControl(type.actif),
    })
    return(typeForm)
  }
  CreateEnvironmentForm(env:Environnement):FormGroup{
    var envForm = new FormGroup({
      environment: new FormControl(env.environment),
      actif: new FormControl(env.actif),
    })
    return(envForm)
  }
  
  openModal1(){
    /*var formation = new Formation
    this.formationForm = this.CreateFormationForm(formation)*/
    $("#myModal1").css("display", "block");
    console.log("opened")
  }
  openModal2(){
    $("#myModal2").css("display", "block");
  }
  openModal3(){
    $("#myModal3").css("display", "block");
  }
  closeModal(){
    this.update=false
    this.submitted=false;
    this.formationForm.reset()
    $(".modal").css("display", "none");
  }
  
  select(e){
    if(e=="1"){
      this.clicked=true
      $("#formation-tab").attr('class','nav-link active')
      $("#prog-tab").attr('class','nav-link')
    }
    else{
      this.clicked=false
      $("#prog-tab").attr('class','nav-link active')
      $("#formation-tab").attr('class','nav-link')
    }
  }
  verifyTypeActif(i){
    return($('input[name=typecheck'+i+']').prop('checked'));
  }
  verifyFormationActif(i){
    return($('input[name=formationcheck'+i+']').prop('checked'));
  }
  verifyEnvActif(i){
    return($('input[name=envcheck'+i+']').prop('checked'));
  }
  selectTypeEnv(){
    $('option[value='+this.formation.type+']').attr('selected',true)
    $('option[value='+this.formation.environment+']').attr('selected',true)
  }
  getFormation(){
    this.fs.getFormation("http://localhost:3002/workshop").subscribe((resp:any[]) => { 
      this.formations=resp;this.nb_formations=this.formations.length
      console.log(this.formations)
    });
  }
  createFormation(formation){
    this.fs.addFormation("http://localhost:3002/workshop",formation).subscribe((data:any)=>{this.formations.unshift(data);this.nb_formations = this.formations.length})
    
  }
  deleteFormation(formation){
    this.fs.deleteFormation("http://localhost:3002/workshop/"+formation._id).subscribe((data:any)=>{
      this.getFormation()
    })
  }
  getFormerFormation(formation:Formation,i){
    this.update = true
    this.openModal1()
    var ff = this.CreateFormationForm(formation)
    this.formationForm = ff
  }
  getFormationToUpdate(formation:Formation){
    this.formation = formation
  }
  updateFormation(){
    this.submitted = true;
    if (this.formationForm.invalid) {
      this.select("1")
      return;
  }
    this.date = new Date()
    var formation = this.formation
    formation.intitule=this.formationForm.get('intitule').value
    formation.intituleCertification=this.formationForm.get('intituleCertification').value
    formation.referance=this.formationForm.get('referance').value
    formation.designation=this.formationForm.get('designation').value
    formation.tarif=this.formationForm.get('tarif').value
    formation.code_BFP=this.formationForm.get('code_BFP').value
    formation.Url_formation=this.formationForm.get('Url_formation').value
    formation.prestataire_Elearning=this.formationForm.get('prestataire_Elearning').value
    formation.cout_Elearning=this.formationForm.get('cout_Elearning').value
    formation.coutCertification=this.formationForm.get('coutCertification').value
    formation.prestataireCertification=this.formationForm.get('prestataireCertification').value
    formation.intituleCertification=this.formationForm.get('intituleCertification').value
    formation.UrlCertification=this.formationForm.get('UrlCertification').value
    formation.modalitePedagogique=this.formationForm.get('modalitePedagogique').value
    formation.Objectifs=this.formationForm.get('Objectifs').value
    formation.Prerequis=this.formationForm.get('Prerequis').value
    formation.resultats_attendus=this.formationForm.get('resultats_attendus').value
    formation.certification=this.formationForm.get('certification').value
    formation.nombre_Heures = this.formationForm.get('nombre_Heures').value
    formation.Duree=this.formationForm.get('Duree').value
    formation.public=this.formationForm.get('public').value
    formation.contenu=this.formationForm.get('contenu').value
    formation.type=this.formationForm.get('type').value
    formation.environment=this.formationForm.get('environment').value
    formation.etat = this.formationForm.get('etat').value
    formation.date_modif= this.date
    console.log(formation.date_modif)
    this.fs.updateFormation("http://localhost:3002/workshop",formation).subscribe((data:any)=>this.formations[this.formations.indexOf(formation)]=data)
    this.closeModal();
    this.update = false
  }
  get f() { return this.formationForm.controls; }
  onSubmitFormation() {
    // TODO: Use EventEmitter with form value
    this.submitted = true;
    if (this.formationForm.invalid) {
      this.select("1")
      return;
  }
    var formation = new Formation;
    formation.intitule=this.formationForm.get('intitule').value
    formation.intituleCertification=this.formationForm.get('intituleCertification').value
    formation.referance=this.formationForm.get('referance').value
    formation.designation=this.formationForm.get('designation').value
    formation.tarif=this.formationForm.get('tarif').value
    formation.code_BFP=this.formationForm.get('code_BFP').value
    formation.Url_formation=this.formationForm.get('Url_formation').value
    formation.prestataire_Elearning=this.formationForm.get('prestataire_Elearning').value
    formation.cout_Elearning=this.formationForm.get('cout_Elearning').value
    formation.coutCertification=this.formationForm.get('coutCertification').value
    formation.prestataireCertification=this.formationForm.get('prestataireCertification').value
    formation.intituleCertification=this.formationForm.get('intituleCertification').value
    formation.UrlCertification=this.formationForm.get('UrlCertification').value
    formation.modalitePedagogique=this.formationForm.get('modalitePedagogique').value
    formation.Objectifs=this.formationForm.get('Objectifs').value
    formation.Prerequis=this.formationForm.get('Prerequis').value
    formation.resultats_attendus=this.formationForm.get('resultats_attendus').value
    formation.nombre_Heures = this.formationForm.get('nombre_Heures').value
    formation.certification=this.formationForm.get('certification').value
    formation.Duree=this.formationForm.get('Duree').value
    formation.public=this.formationForm.get('public').value
    formation.contenu=this.formationForm.get('contenu').value
    formation.type=this.formationForm.get('type').value
    formation.environment=this.formationForm.get('environment').value
    formation.etat= this.formationForm.get('etat').value
    formation.date_modif= this.date
    console.log(formation)
    this.createFormation(formation)
    this.closeModal()
  }
  updateEtat(f:Formation,i){
    f.etat = this.verifyTypeActif(i)
    this.fs.updateFormation("http://localhost:3002/workshop",f).subscribe((data:any)=>{this.formations[i].etat=data.etat;
    console.log(this.formations[i].etat)
  })
  }
  getType(){
    this.ts.getType("http://localhost:3002/type").subscribe((resp:any[]) => { 
      this.types=resp;this.nb_type=this.types.length;
      console.log(this.types)
    });
      
  }
  getTypeActive(){
    this.ts.getType("http://localhost:3002/type/etat").subscribe((resp:any[]) => { 
      this.typesActives=resp
      console.log(this.typesActives)
    });
  }
  createType(type){
    this.ts.addType("http://localhost:3002/type",type).subscribe((data:any)=>{this.types.unshift(data);this.nb_type=this.types.length;})
  }
  deleteType(type){
    this.ts.deleteType("http://localhost:3002/type/"+type._id).subscribe((data:any)=>this.getType())
  }
  updateType(type:Type,i){
    type.actif = this.verifyTypeActif(i)
    this.ts.updateType("http://localhost:3002/type",type).subscribe((data:any)=>{this.types[i].actif=data.actif;
    console.log(this.types[i].actif)
  })
  }
  onSubmitType(){
    var type = new Type;
    type.type = this.typeForm.get('type').value
    type.actif = this.typeForm.get('actif').value
    this.createType(type)
    this.closeModal()
  }
  getEnvironnement(){
    this.es.getEnvironnement("http://localhost:3002/environment").subscribe((resp:any[]) => { 
      this.environments=resp;this.nb_env=this.environments.length});
      
  }
  getEnvironnementActive(){
    this.es.getEnvironnement("http://localhost:3002/environment/etat").subscribe((resp:any[]) => { 
      this.environmentActive=resp});
  }
  createEnvironnement(environment){
    this.es.addEnvironnement("http://localhost:3002/environment",environment).subscribe((data:any)=>{this.environments.unshift(data);this.nb_env=this.environments.length})
  }
  deleteEnv(env){
    this.es.deleteEnv("http://localhost:3002/environment/"+env._id).subscribe((data:any)=>this.getEnvironnement())
  }
  updateEnvironnement(env:Environnement,i){
    env.actif = this.verifyEnvActif(i)
    this.ts.updateType("http://localhost:3002/environment",env).subscribe((data:any)=>this.environments[i].actif=data.actif)
  }
  onSubmitEnvironnement(){
    var environment = new Environnement;
    environment.environment = this.envForm.get('environment').value
    environment.actif = this.envForm.get('actif').value
    this.createEnvironnement(environment)
    this.closeModal()
  }
  show=[true,false,false]
  selectWindow(id){
    let i=0
    for(let s of this.show){
      this.show[i]=false
      $("#nav-tab > button:nth-child("+(i+1)+")").attr('class','nav-link')
      i++
    }
    this.show[id]=true
    $("#nav-tab > button:nth-child("+(id+1)+")").attr('class','nav-link active')
    console.log(this.show)
  }
  shows=[true,false]
  showBar(){
    $(".header").css('display','flex')
    $(".navigation").css('display','flex')
  }
}
