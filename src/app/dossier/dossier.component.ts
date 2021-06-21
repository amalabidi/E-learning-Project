import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, FormArray, Validators } from '@angular/forms';
import { Folder } from '../dossier/dossier'

import { DossierService } from '../services/DossierService/dossier.service'
import { FormationService } from '../services/FormationService/formation.service'
import { ProvenanceService } from '../services/ProvenanceService/provenance.service'
import { PermissionsService } from '../services/PermissionService/permissions.service'
import { UserService } from '../services/UserService/user.service'
import { File } from '../dossier/file'
import { UploadService } from '../services/UploadService/upload.service'
import { DownloadService } from '../services/DownloadService/download.service'
import { ExportService } from '../services/ExportService/export.service'
import { PdffillerService } from '../services/PDFFiller/pdffiller.service'
import { SettingService } from '../services/SettingsService/setting.service'
import {SignatureService} from '../services/Signature/signature.service'
import { ConnecteduserService } from '../services/ConnectedUsers/connecteduser.service'
import { MailService } from '../services/MailService/mail.service'
import {Signature} from '../dossier/signature'
import { saveAs } from 'file-saver';
import $ from 'jquery'
import {Email} from '../dossier/email';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { convertCompilerOptionsFromJson } from 'typescript';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FilterService } from '../services/FilterService/filter.service'
declare var require: any
const FileSaver = require('file-saver');
@Component({
  selector: 'app-dossier',
  templateUrl: './dossier.component.html',
  styleUrls: ['./dossier.component.css']
})
export class DossierComponent implements OnInit ,AfterViewInit{
  dropdownSettings:IDropdownSettings = {};
  searchFolder
  show=false
  showcoach=false
  shows:boolean[]=[true,false,false,false,false,false,false,false,false]
  showFilter:boolean[]=[true,false,false,false,false,false,false,false,false,false,false,false]
  dossierForm:FormGroup;
  dossiers;
  nb_dossier
  status=[]
  statusCall=[]
  qualification=[]
  clients=[]
  formations=[]
  allFormations=[]
  provenances=[]
  vendeurs=[]
  coachs=[]
  searchFormation
  showlistFor: boolean=false;
  selectedFormation
  intituleCertification: any;
  UrlCertification: any;
  PrestataireCertification: any;
  coutCertification: any;
  mfacture: any;
  idWorkshop: any;
  dossier: any;
  update: boolean=false;
  evaluation=[];
  crCoach=[];
  facturation=[];
  preval=[];
  provenancesName: any[]=[];
  vendeurName: any[]=[];
  formationName:any[]=[];
  type=["Prospect","Client"]
  paye=["Vendeur payé","Vendeur non payé","Coach payé","Coach non payé"]
  priseEncharge=["CPF","OPCA","Financement perso"]
  folder={
    dossier:"",
    client:"",
    preval:"",
    evalu:"",
    crcoach:"",
    fact:"",
    formation:"",
    files:"",
    filledFiles:"",
    vendeur:"",
    coach:"",
    provenance:"",
    commMail:"",
    journalAppel:[],
  }
  data=[]
  SingleData
  userSearch
  filterCheck: boolean;
  submitted: boolean=false;
  constructor(
    private ds:DossierService,
    private fs:FormationService,
    private ps:ProvenanceService,
    private perms:PermissionsService,
    private us:UserService,
    private ups:UploadService,
    private downs:DownloadService,
    private es:ExportService,
    private pdfs:PdffillerService,
    private ss:SettingService,
    private sign:SignatureService,
    private cus:ConnecteduserService,
    private ms:MailService,
    private filter:FilterService,
    ) { 
      $(document).ready(function(){
        $("#formation").click(function(){
            $(this).find(".dropdown-menu").slideToggle("fast");
        });
    });
    $(document).on("click", function (event) {
      var clickedBtnID = $(event.target).attr('id');
      if(clickedBtnID!=="formation"){
        $(".dropdown-menu").slideUp("fast");
      }else{
        $(".dropdown-menu").slideDown("fast");    
      }
   });
    }

  ngOnInit(): void {
    this.getDosssier()
    this.getAllWorkshop()
    this.getProvenance()
    this.getPermissions()
    this.getCoachs()
    this.getVenders()
    this.getSetting()
    this.getUsers()
    let dossier=new Folder
    this.dossierForm=this.CreateDossierForm(dossier)
  }
  ngAfterViewInit(){
    console.log(this.data)
    this.injectStyle()
    this.injectPaginationStyle()
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
  numero=0
  async getAllData(d,update=false){
    let folder = {
      numero:this.numero+1,
      dossier:[],
      client:[],
      preval:[],
      evalu:[],
      crcoach:[],
      fact:[],
      formation:[],
      files:[],
      filledFiles:[],
      vendeur:[],
      coach:[],
      provenance:[],
      commMail:[],
      journalAppel:[],
    }

        folder.dossier=d;
        this.getClients(d.client,folder)
        this.getPreval(d.preEvaluation,folder)
        this.getEval(d.evaluation,folder)
        this.getCRcoach(d.crCoach,folder)
        this.getFacturation(d.facturation,folder)
        this.getWorkshop(d.idWorkshop,folder)
        this.getFilesFromFolder(d,folder)
        this.getFilledFilesFromFolder(d._id,folder)
        this.getVenderByID(d.vendeur,folder)
        this.getCoachByID(d.coach,folder)
        this.getProvenanceById(d.provenance,folder)
        this.getCommMail(folder)
        this.getjournalAppel(d._id,folder)
      
      if(!update){
        this.data.unshift(folder)
        this.numero++
      }
      else{
        let index = this.data.indexOf(this.SingleData,0)
        this.data[index]=folder
      }
    
  }


  getNumberOfFiles(data){
    return(data.files.length)
  }

  ajouter(update:boolean){
    let folder={
      dossier:[],
      client:[],
      preval:[],
      evalu:[],
      crcoach:[],
      fact:[],
      formation:[],
      files:[],
      filledFiles:[],
      vendeur:[],
      coach:[],
      provenance:[],
      commMail:[],
      journalAppel:[],
    }
    if(!update){
      this.SingleData=folder
      let d=new Folder
      this.dossierForm=this.CreateDossierForm(d)
    }
      this.show=true
      this.update=update

  }
  revenir(){
    this.show=false

  }
  selectionner(id){
    var i=0
    for(let s of this.shows){
      this.shows[i]=false
      $("[tabindex="+i+"]").attr('class','tabs__tab tabs__tab')
      i++
    }
    
   this.shows[id]=true;
   $("[tabindex="+id+"]").attr('class','tabs__tab tabs__tab--active');
  }
  selectionnerFilter(id){
    var i=0
    for(let s of this.showFilter){
        this.showFilter[i] =false
        $("[tabindex="+(i+9)+"]").attr('class','tabs__tab tabs__tab')
        i++
    }
    
   this.showFilter[id]=true;
   $("[tabindex="+(id+9)+"]").attr('class','tabs__tab tabs__tab--active');
  }
  
  showlistcoach(){
    this.showcoach=this.dossierForm.get('coaching').value
  }
  CreateDossierForm(folder:Folder):FormGroup{
    var dossierForm = new FormGroup({
      civility: new FormControl(folder.civility),
      firstName: new FormControl(folder.firstName),
      lastName: new FormControl(folder.lastName),
      dateOfBirth: new FormControl(folder.dateOfBirth),
      email: new FormControl(folder.email,[Validators.required,Validators.email]),
      mobile: new FormControl(folder.mobile,Validators.required),
      fixe: new FormControl(folder.fixe),
      adresse: new FormControl(folder.adresse),
      codePostal: new FormControl(folder.codePostal),
      ville: new FormControl(folder.ville),
      budgetCPF: new FormControl(folder.budgetCPF),
      budgetDIF: new FormControl(folder.budgetDIF),
      difDisponibility: new FormControl(folder.difDisponibility),
      qualification: new FormControl(folder.qualification),
      rechercheEmploi: new FormControl(folder.rechercheEmploi),
      langue: new FormControl(folder.langue),
      niveau: new FormControl(folder.niveau),
      niveauEstimation: new FormControl(folder.niveauEstimation),
      note: new FormControl(folder.note),
      grammaire: new FormArray([
        new FormControl(),
        new FormControl(),
        new FormControl(),
        new FormControl(),
        new FormControl(),
      ]),
      vocabulaire: new FormArray([
        new FormControl(),
        new FormControl(),
        new FormControl(),
        new FormControl(),
        new FormControl(),
      ]),
      comprehensionOrale: new FormArray([
        new FormControl(),
        new FormControl(),
        new FormControl(),
        new FormControl(),
        new FormControl(),
        new FormControl(),
        new FormControl(),
      ]),
      attentes: new FormArray([
        new FormControl(),
        new FormControl(),
        new FormControl(),
        new FormControl(),
        new FormControl(),
      ]),
      duree: new FormControl(folder.duree),
      prochainesAttentes: new FormControl(folder.prochainesAttentes),
      autorisation: new FormControl(folder.autorisation),
      estimation: new FormControl(folder.estimation),
      questionsRestées: new FormControl(folder.questionsRestées),
      avisPasserelle: new FormControl(folder.avisPasserelle),
      avisExplication: new FormControl(folder.avisExplication),
      suggestions: new FormControl(folder.suggestions),
      pedagogieCoach: new FormControl(folder.pedagogieCoach),
      ecouteCoach: new FormControl(folder.ecouteCoach),
      claireteCoach: new FormControl(folder.claireteCoach),
      adj1: new FormControl(folder.adj1),
      adj2: new FormControl(folder.adj2),
      adj3: new FormControl(folder.adj3),            
      connaissance: new FormControl(folder.connaissance),
      correspondanceFormation: new FormControl(folder.correspondanceFormation),
      implicationStagiaire: new FormControl(folder.implicationStagiaire),
      compteRenduFormation: new FormControl(folder.compteRenduFormation),
      programmeVu: new FormControl(folder.programmeVu),
      progressionStagiaire: new FormControl(folder.progressionStagiaire),
      MontantFacture: new FormControl({value:folder.MontantFacture,disabled: true}),
      CoutElearning: new FormControl({value:folder.CoutElearning,disabled: true}),
      DateReglementElearning: new FormControl(folder.DateReglementElearning),
      CoutCertification: new FormControl({value:folder.CoutCertification,disabled: true}),
      DateReglementCertif: new FormControl(folder.DateReglementCertif),
      ElearningPaye: new FormControl(folder.ElearningPaye),
      CertifPaye: new FormControl(folder.CertifPaye),
      AutreCout1: new FormControl(folder.AutreCout1),
      AutreCout2: new FormControl(folder.AutreCout2),
      DateReglementCout1: new FormControl(folder.DateReglementCout1),
      DateReglementCout2: new FormControl(folder.DateReglementCout2),
      Cout1Paye: new FormControl(folder.Cout1Paye),
      Cout2Paye: new FormControl(folder.Cout2Paye),
      CoutCoach: new FormControl({value:folder.CoutCoach,disabled: true}),
      DateReglementCoach: new FormControl(folder.DateReglementCoach),
      CoachPaye: new FormControl(folder.CoachPaye),
      CoutVendeur: new FormControl({value:folder.CoutVendeur,disabled: true}),
      DateReglementVendeur: new FormControl(folder.DateReglementVendeur),
      VendeurPaye: new FormControl(folder.VendeurPaye),
      Factor: new FormControl(folder.Factor),
      status: new FormControl(folder.status),
      type: new FormControl(folder.type,Validators.required),
      rappelGestionnaire: new FormControl(folder.rappelGestionnaire),
      dateRappel: new FormControl(folder.dateRappel),
      provenance: new FormControl(folder.provenance,Validators.required),
      statusCall: new FormControl(folder.statusCall,Validators.required),
      vendeur: new FormControl(folder.vendeur,Validators.required),
      categorie: new FormControl(folder.categorie,Validators.required),
      entreprise: new FormControl(folder.entreprise),
      numeroEdOF: new FormControl(folder.numeroEdOF),
      confidentialObservation: new FormControl(folder.confidentialObservation),
      priseEnCharge: new FormArray([
        new FormControl(false),
        new FormControl(false),
        new FormControl(false),
        new FormControl({value:0,disabled: true}),
        new FormControl({value:0,disabled: true}),
        new FormControl({value:0,disabled: true}),
      ]),
      workshopBeginDate: new FormControl(folder.workshopBeginDate),
      workshopEndDate: new FormControl(folder.workshopEndDate),
      workshopDescription: new FormControl(folder.workshopDescription),
      coaching: new FormControl(folder.coaching),
      coach: new FormControl(folder.coach),
      certification: new FormControl(folder.certification),
      certificationId: new FormControl(folder.certificationId),
      certificationPassword: new FormControl(folder.certificationPassword),
      appointments: new FormArray([
        new FormControl(),
        new FormControl(),
        new FormControl(),
        new FormControl()
      ]),
      performedAppointments: new FormArray([
        new FormControl(),
        new FormControl(),
        new FormControl(),
        new FormControl()
      ]),
      appointmentsObservation: new FormArray([
        new FormControl(),
        new FormControl(),
        new FormControl(),
        new FormControl()
      ]),
      NFacturation:new FormControl({value:folder.NFacturation,disabled: true}),
      DateFacturation:new FormControl({value:folder.DateFacturation,disabled: true}),
      NAvoir:new FormControl({value:folder.NAvoir,disabled: true}),
      DateAvoir:new FormControl({value:folder.DateAvoir,disabled: true})
    })
    return(dossierForm)
  }
  videTonull(v){
    if(v){
      if(v.length==0){
        return(null)
      }
      else {return v}
    }
    return(null)

  }
  RecalculMontant(){
    var f =this.allFormations.find(formation=>formation.intitule===this.searchFormation)
    
    var remiseCPF=this.dossierForm.get('priseEnCharge').value[3] ? this.dossierForm.get('priseEnCharge').value[3]:0
    var remiseOPCA=this.dossierForm.get('priseEnCharge').value[4] ? this.dossierForm.get('priseEnCharge').value[4]:0
    var remisePerso=this.dossierForm.get('priseEnCharge').value[5] ? this.dossierForm.get('priseEnCharge').value[5]:0

    if(f){
      this.getFormation(f)
      let prix
      prix= ((+f.tarif) - (+remiseCPF)-(+remiseOPCA)-(+remisePerso)).toString()
      this.dossierForm.get("MontantFacture").patchValue(prix)
      if(prix=="NaN"){
      this.dossierForm.get("MontantFacture").patchValue("0")
      this.idWorkshop=null
        return("0")
      }
      return(prix)
    }
    else{
      this.idWorkshop=null
      this.dossierForm.get("MontantFacture").patchValue("0")
      return("0")
    }

  }
  generateFactureNumber(){
    let facture=[]
    let fact="FCPF"
    let av="AVCPF"
    let numeroFac=""
    let numero=0
    this.data.forEach(d=>{
      if(!d.fact[0].NFacturation){
        facture.unshift(0)
      }else{
        facture.unshift(d.fact[0].NFacturation.substring(4,d.fact[0].NFacturation.length))
      }
    })
    numero=Math.max.apply(Math, facture)+1
    this.numeroFac=fact+numero.toString()
    while(this.numeroFac.length<9){
      this.numeroFac=[this.numeroFac.slice(0, 4),"0",this.numeroFac.slice(4)].join(''); 
    }
    this.dossierForm.get('NFacturation').patchValue(this.numeroFac)
    this.dossierForm.get('DateFacturation').patchValue(this.formaterDate(this.dateFac))

  }
  generateAvoirNumber(){
    let facture=[]
    let av="AVCPF"
    let numeroFac=""
    let numero=0
    
    this.data.forEach(d=>{
      if(!d.fact[0].NAvoir){
        facture.unshift(0)
      }else{
        facture.unshift(d.fact[0].NAvoir.substring(5,d.fact[0].NAvoir.length))
      }
    })
    numero=Math.max.apply(Math, facture)+1
    this.numeroAvoir=av+numero.toString()
    while(this.numeroAvoir.length<10){
      this.numeroAvoir=[this.numeroAvoir.slice(0, 5),"0",this.numeroAvoir.slice(5)].join(''); 
    }
    this.dossierForm.get('NAvoir').patchValue(this.numeroAvoir)
    this.dossierForm.get('DateAvoir').patchValue(this.formaterDate(this.dateAvoir))
  }
  numeroFac=""
  numeroAvoir=""
  dateAvoir= new Date()
  dateFac=new Date()
  showbuttonFac=true;
  showbuttonAvoir=true
  stringTobool(d){
    if(d=="true"){
      return(true)
    }else if(d=="false"){
      return false
    }else {
      return null
    }
  }
  boolTostring(d){
    if(d==true){
      return("true")
    }else if(d==false){
      return "false"
    }else {
      return null
    }
  }
  setFolderForm(data){
    let folder = data.dossier
    let vendeur =this.videTonull(data.vendeur) ? data.vendeur[0] : ""
    let coach = this.videTonull(data.coach) ? data.coach[0] : ""
    let client =this.videTonull(data.client) ? data.client[0] : ""
    let prev =this.videTonull(data.preval)? data.preval[0] : ""
    let evaluation =this.videTonull(data.evalu)?data.evalu[0]:""
    let crCoach=this.videTonull(data.crcoach)? data.crcoach[0]:""
    let facture=this.videTonull(data.fact)?data.fact[0]:""
    let formation=this.videTonull(data.formation)?data.formation[0]:""
    if(facture?.NFacturation){
      this.showbuttonFac=false
    }else{
      this.showbuttonFac=true
    }
    if(facture?.NAvoir){
      this.showbuttonAvoir=false
    }else{
      this.showbuttonAvoir=true
    }
 try{
    this.searchFormation=this.allFormations.find(formation=>formation._id===folder.idWorkshop)?.intitule
    this.mfacture=this.allFormations.find(formation=>formation._id===folder.idWorkshop)?.tarif
    this.intituleCertification=this.allFormations.find(formation=>formation._id===folder.idWorkshop)?.intituleCertification
    this.PrestataireCertification=this.allFormations.find(formation=>formation._id===folder.idWorkshop)?.PrestataireCertification
    this.coutCertification=formation?.CoutCertification
    this.UrlCertification=this.allFormations.find(formation=>formation._id===folder.idWorkshop)?.UrlCertification
    this.idWorkshop=this.allFormations.find(formation=>formation._id===folder.idWorkshop)?._id

    if(!this.mfacture){
      this.mfacture=0
    }
  }catch(e){
    console.log(e)
  }
    setTimeout(()=>{
    const rappelGestionnaire=this.formaterDateTime(folder.rappelGestionnaire)
    const dateOfBirth =this.formaterDate(client.dateOfBirth)
    const DateReglementElearning =this.formaterDateTime(facture.DateReglementElearning)
    const DateReglementCertif =this.formaterDateTime(facture.DateReglementCertif)
    const DateReglementCout1 =this.formaterDateTime(facture.DateReglementCout1)
    const DateReglementCout2 =this.formaterDateTime(facture.DateReglementCout2)
    const DateReglementCoach =this.formaterDateTime(facture.DateReglementCoach)
    const DateReglementVendeur =this.formaterDateTime(facture.DateReglementVendeur)
    const dateRappel =this.formaterDateTime(folder.dateRappel)
    const workshopBeginDate =this.formaterDate(folder.workshopBeginDate)
    const workshopEndDate =this.formaterDate(folder.workshopEndDate)
    let appointments=[]
    if(folder.appointments){
      folder.appointments.forEach(a=>{
        appointments.unshift(this.formaterDateTime(a))
      })
    }try{
    this.dossierForm.setValue({
      civility: this.checkValue(client?.civility),
      firstName: this.checkValue(client?.firstName),
      lastName: this.checkValue(client?.lastName),
      dateOfBirth: this.checkValue(dateOfBirth),
      email: this.checkValue(client?.email),
      mobile: this.checkValue(client?.mobile),
      fixe: this.checkValue(client?.fixe),
      adresse: this.checkValue(client?.adresse),
      codePostal: this.checkValue(client?.codePostal),
      ville: this.checkValue(client?.ville),
      budgetCPF: this.checkValue(client?.budgetCPF),
      budgetDIF: this.checkValue(client?.budgetDIF),
      difDisponibility: this.checkValue(client?.difDisponibility),
      qualification: this.checkValue(client?.qualification),
      rechercheEmploi: this.checkValue(client?.rechercheEmploi),
      langue: this.checkValue(prev?.langue),
      niveau: this.checkValue(prev?.niveau),
      niveauEstimation: this.checkValue(prev?.niveauEstimation),
      note: this.checkValue(prev?.note),
      grammaire: this.checkValue(prev?.grammaire),
      vocabulaire: this.checkValue(prev?.vocabulaire),
      comprehensionOrale: this.checkValue(prev?.comprehensionOrale),
      attentes: this.checkValue(evaluation?.attentes),
      duree: this.checkValue(evaluation?.duree),
      prochainesAttentes: this.checkValue(evaluation?.prochainesAttentes),
      autorisation: this.formaterNull(evaluation?.autorisation),
      estimation: this.checkValue(evaluation?.estimation),
      questionsRestées: this.formaterNull(evaluation?.questionsRestées),
      avisPasserelle: this.checkValue(evaluation?.avisPasserelle),
      avisExplication: this.checkValue(evaluation?.avisExplication),
      suggestions: this.checkValue(evaluation?.suggestions),
      pedagogieCoach: this.checkValue(evaluation?.pedagogieCoach),
      ecouteCoach: this.checkValue(evaluation?.ecouteCoach),
      claireteCoach: this.checkValue(evaluation?.claireteCoach),
      adj1: this.checkValue(evaluation?.adj1),
      adj2: this.checkValue(evaluation?.adj2),
      adj3: this.checkValue(evaluation?.adj3),            
      connaissance: this.boolTostring(crCoach?.connaissance),
      correspondanceFormation: this.boolTostring(crCoach?.correspondanceFormation),
      implicationStagiaire: this.boolTostring(crCoach?.implicationStagiaire),
      compteRenduFormation: this.checkValue(crCoach?.compteRenduFormation),
      programmeVu: this.boolTostring(crCoach?.programmeVu),
      progressionStagiaire: this.boolTostring(crCoach?.progressionStagiaire),
      MontantFacture: this.checkValue(this.mfacture),
      CoutElearning: this.checkValue(formation?.Cout_Elearning),
      DateReglementElearning: this.checkValue( DateReglementElearning),
      CoutCertification: this.checkValue( formation?.CoutCertification),
      DateReglementCertif: this.checkValue(DateReglementCertif),
      ElearningPaye: this.checkValue(facture?.ElearningPaye),
      CertifPaye: this.checkValue(facture?.CertifPaye),
      AutreCout1: this.checkValue(facture?.AutreCout1),
      AutreCout2: this.checkValue(facture?.AutreCout2),
      DateReglementCout1: this.checkValue(DateReglementCout1),
      DateReglementCout2: this.checkValue(DateReglementCout2),
      Cout1Paye: this.checkValue(facture?.Cout1Paye),
      Cout2Paye: this.checkValue(facture?.Cout2Paye),
      CoutCoach: this.checkValue(coach?.tarif),
      DateReglementCoach: this.checkValue(DateReglementCoach),
      CoachPaye: this.checkValue(facture?.CoachPaye),
      NFacturation:this.checkValue(facture?.NFacturation),
      DateFacturation:this.checkValue(this.formaterDate((facture?.DateFacturation))),
      NAvoir:this.checkValue(facture?.NAvoir),
      DateAvoir:this.checkValue(this.formaterDate((facture?.DateAvoir))),
      CoutVendeur: this.checkValue(vendeur?.tarif),
      DateReglementVendeur: this.checkValue(DateReglementVendeur),
      VendeurPaye: this.checkValue(facture?.VendeurPaye),
      Factor: this.checkValue(facture?.Factor),
      status: this.checkValue(folder?.status),
      type: this.checkValue(folder?.type),
      rappelGestionnaire: this.checkValue(rappelGestionnaire),
      dateRappel: this.checkValue(dateRappel),
      provenance: this.checkValue(folder?.provenance),
      statusCall: this.checkValue(folder?.statusCall),
      vendeur: this.checkValue(folder?.vendeur),
      categorie: this.checkValue(folder?.categorie),
      entreprise: this.checkValue(folder?.entreprise),
      numeroEdOF: this.checkValue(folder?.numeroEdOF),
      confidentialObservation: this.checkValue(folder?.confidentialObservation),
      priseEnCharge: this.checkValue(folder?.priseEnCharge),
      workshopBeginDate: this.checkValue(workshopBeginDate),
      workshopEndDate: this.checkValue(workshopEndDate),
      workshopDescription: this.checkValue(folder?.workshopDescription),
      coaching: this.checkValue(folder?.coaching),
      coach: this.checkValue(folder?.coach),
      certification: this.checkValue(folder?.certification),
      certificationId: this.checkValue(folder?.certificationId),
      certificationPassword: this.checkValue(folder?.certificationPassword),
      appointments: this.checkValue(appointments),
      performedAppointments: this.checkValue(folder?.performedAppointments),
      appointmentsObservation: this.checkValue(folder?.appointmentsObservation)
    })}catch(e){
      
    }
    this.showlistcoach()
    this.RecalculMontant()
    this.activateRemise()
  })
  }
  checkValue(d){
    return (d? d : null)
  }
  getDosssier(){
    this.ds.getFolder('http://localhost:3002/dossier')
    .subscribe((data:any)=>{
        this.dossiers=data;this.nb_dossier=this.dossiers.length;
          this.dossiers.forEach(d => {
            this.getAllData(d)
          });       
    })
    
  }
  getClients(id,f){
    this.ds.getFolder('http://localhost:3002/dossier/client/'+id)
    .subscribe((data:any)=>{
        f.client=data
        this.clients.unshift(data[0])
    })
  }
  getEval(id,f){
    this.ds.getFolder('http://localhost:3002/dossier/eval/'+id)
    .subscribe((data:any)=>{
      f.evalu=data
  })
  }
  getCRcoach(id,f){
    this.ds.getFolder('http://localhost:3002/dossier/crcoach/'+id)
    .subscribe((data:any)=>{
      f.crcoach=data
  })
  }
  getFacturation(id,f){
    this.ds.getFolder('http://localhost:3002/dossier/facturation/'+id)
    .subscribe((data:any)=>{
      f.fact=data
  })
  }
  getPreval(id,f){
    this.ds.getFolder('http://localhost:3002/dossier/preval/'+id)
    .subscribe((data:any)=>{
      f.preval=data
  })
  }
  getjournalAppel(id,f){
    this.ds.getFolder('http://localhost:3002/dossier/journalAppel/'+id).subscribe((data:any)=>{
      f.journalAppel=data
    })
  }
  getWorkshop(id,f){
    this.fs.getFormation('http://localhost:3002/workshop/'+id)
    .subscribe((data:any)=>{
      f.formation=data
    })
  }
  getAllWorkshop(){
    this.fs.getFormation('http://localhost:3002/workshop/etat').subscribe((data:any)=>{
      this.allFormations=this.allFormations.concat(data)
      this.allFormations.forEach(f=>{
        this.formationName=this.formationName.concat(f?.intitule)
      })
    })
  }
  getProvenance(){
    this.ps.getProv('http://localhost:3002/provenance/etat').subscribe((data:any)=>{
      this.provenances=data
      this.provenances.forEach(p=>{
        this.provenancesName=this.provenancesName.concat(p.provenance)
      })
    })
  }
  getProvenanceById(id,f){
    this.ps.getProv('http://localhost:3002/provenance/'+id)
    .subscribe((data:any)=>{
      f.provenance=data
    })
  }
  getPermissions(){
    this.perms.getPermissions().subscribe((data:any)=>{
      this.status=this.status.concat(data.status)
      this.statusCall=this.statusCall.concat(data.statusCall)
      this.qualification=this.qualification.concat(data.qualification)
    })
  }
  getVenders(){
    let habilitation="Vendeur"
    this.us.getUser("http://localhost:3002/user/filter/"+habilitation).subscribe((data:any)=>{
      this.vendeurs=data
      this.vendeurs.forEach(v=>{
        this.vendeurName=this.vendeurName.concat(v.name+" "+v.lastname)
      })
    })
  }
  users=[]
  getUsers(){
    this.us.getUser("http://localhost:3002/user/").subscribe((data:any)=>{
      this.users=data
      /*this.users.forEach(user=>{
        this.userChecked.unshift(this.createItem())
      })*/
    })
  }
  getVenderByID(id,f){
    this.us.getUser("http://localhost:3002/user/"+id)
    .subscribe((data:any)=>{
      f.vendeur=data
    })
  }
  getCoachByID(id,f){
    this.us.getUser("http://localhost:3002/user/"+id)
    .subscribe((data:any)=>{
      f.coach=data
    })
  }

  getCoachs(){
    let hab="Coachs"
    this.us.getUser("http://localhost:3002/user/filter/"+hab).subscribe((data:any)=>{
      this.coachs=data
    })
  }
  getFormation(f){
    if(f==0){
      this.selectedFormation=null
      return
    }
    this.searchFormation=f.intitule
    this.selectedFormation=f
    this.setCertForm(f)
  }
  setCertForm(f){
      this.intituleCertification= f?.intituleCertification
      this.UrlCertification=f?.UrlCertification
      this.PrestataireCertification=f?.PrestataireCertification
      this.coutCertification=f?.coutCertification
      this.idWorkshop=f?._id
      this.mfacture=f?.tarif
      this.dossierForm.patchValue({
        MontantFacture:this.mfacture
      })
  }
  ajouterDossier(){
    let dossier=new Folder
    dossier.civility=this.dossierForm.get('civility').value;
    dossier.firstName=this.dossierForm.get('firstName').value;
    dossier.lastName=this.dossierForm.get('lastName').value;
    dossier.dateOfBirth=this.dossierForm.get('dateOfBirth').value;
    dossier.email=this.dossierForm.get('email').value;
    dossier.mobile=this.dossierForm.get('mobile').value;
    dossier.fixe=this.dossierForm.get('fixe').value;
    dossier.adresse=this.dossierForm.get('adresse').value;
    dossier.codePostal=this.dossierForm.get('codePostal').value;
    dossier.ville=this.dossierForm.get('ville').value;
    dossier.budgetCPF=this.dossierForm.get('budgetCPF').value;
    dossier.budgetDIF=this.dossierForm.get('budgetDIF').value;
    dossier.difDisponibility=this.dossierForm.get('difDisponibility').value;
    dossier.qualification=this.dossierForm.get('qualification').value;
    dossier.rechercheEmploi=this.dossierForm.get('rechercheEmploi').value;
    dossier.langue=this.dossierForm.get('langue').value;
    dossier.niveau=this.dossierForm.get('niveau').value;
    dossier.niveauEstimation=this.dossierForm.get('niveauEstimation').value;
    dossier.note=this.dossierForm.get('note').value;
    dossier.grammaire=this.dossierForm.get('grammaire').value;
    dossier.vocabulaire=this.dossierForm.get('vocabulaire').value;
    dossier.comprehensionOrale=this.dossierForm.get('comprehensionOrale').value;
    dossier.attentes=this.dossierForm.get('attentes').value;
    dossier.duree=this.dossierForm.get('duree').value;
    dossier.prochainesAttentes=this.dossierForm.get('prochainesAttentes').value;
    dossier.autorisation=this.dossierForm.get('autorisation').value=='true';
    dossier.estimation=this.dossierForm.get('estimation').value;
    dossier.questionsRestées=this.dossierForm.get('questionsRestées').value=='true';
    dossier.avisPasserelle=this.dossierForm.get('avisPasserelle').value;
    dossier.avisExplication=this.dossierForm.get('avisExplication').value;
    dossier.suggestions=this.dossierForm.get('suggestions').value;
    dossier.pedagogieCoach=this.dossierForm.get('pedagogieCoach').value;
    dossier.ecouteCoach=this.dossierForm.get('ecouteCoach').value;
    dossier.claireteCoach=this.dossierForm.get('claireteCoach').value;
    dossier.adj1=this.dossierForm.get('adj1').value;
    dossier.adj2=this.dossierForm.get('adj2').value;
    dossier.adj3=this.dossierForm.get('adj3').value;
    dossier.connaissance=this.stringTobool(this.dossierForm.get('connaissance').value);
    dossier.correspondanceFormation=this.stringTobool(this.dossierForm.get('correspondanceFormation').value)
    dossier.implicationStagiaire=this.stringTobool(this.dossierForm.get('implicationStagiaire').value);
    dossier.compteRenduFormation=this.dossierForm.get('compteRenduFormation').value;
    dossier.programmeVu=this.stringTobool(this.dossierForm.get('programmeVu').value);
    dossier.progressionStagiaire=this.stringTobool(this.dossierForm.get('progressionStagiaire').value);
    dossier.MontantFacture=this.dossierForm.get('MontantFacture').value;
    dossier.CoutElearning=this.dossierForm.get('CoutElearning').value;
    dossier.DateReglementElearning=this.dossierForm.get('DateReglementElearning').value;
    dossier.CoutCertification=this.dossierForm.get('CoutCertification').value;
    dossier.DateReglementCertif=this.dossierForm.get('DateReglementCertif').value;
    dossier.ElearningPaye=this.dossierForm.get('ElearningPaye').value;
    dossier.CertifPaye=this.dossierForm.get('CertifPaye').value;
    dossier.AutreCout1=this.dossierForm.get('AutreCout1').value;
    dossier.AutreCout2=this.dossierForm.get('AutreCout2').value;
    dossier.DateReglementCout1=this.dossierForm.get('DateReglementCout1').value;
    dossier.DateReglementCout2=this.dossierForm.get('DateReglementCout2').value;
    dossier.Cout1Paye=this.dossierForm.get('Cout1Paye').value;
    dossier.Cout2Paye=this.dossierForm.get('Cout2Paye').value;
    dossier.CoutCoach=this.dossierForm.get('CoutCoach').value;
    dossier.DateReglementCoach=this.dossierForm.get('DateReglementCoach').value;
    dossier.CoachPaye=this.dossierForm.get('CoachPaye').value;
    dossier.CoutVendeur=this.dossierForm.get('CoutVendeur').value;
    dossier.DateReglementVendeur=this.dossierForm.get('DateReglementVendeur').value;
    dossier.VendeurPaye=this.dossierForm.get('VendeurPaye').value;
    dossier.Factor=this.dossierForm.get('Factor').value;
    dossier.status=this.dossierForm.get('status').value;
    dossier.type=this.dossierForm.get('type').value;
    dossier.rappelGestionnaire=this.dossierForm.get('rappelGestionnaire').value;
    dossier.dateRappel=this.dossierForm.get('dateRappel').value;
    dossier.provenance=this.dossierForm.get('provenance').value;
    dossier.statusCall=this.dossierForm.get('statusCall').value;
    dossier.vendeur=this.dossierForm.get('vendeur').value;
    dossier.categorie=this.dossierForm.get('categorie').value;
    dossier.entreprise=this.dossierForm.get('entreprise').value;
    dossier.numeroEdOF=this.dossierForm.get('numeroEdOF').value;
    dossier.confidentialObservation=this.dossierForm.get('confidentialObservation').value;
    dossier.idWorkshop=this.idWorkshop
    dossier.priseEnCharge=this.dossierForm.get('priseEnCharge').value;
    dossier.workshopBeginDate=this.dossierForm.get('workshopBeginDate').value;
    dossier.workshopEndDate=this.dossierForm.get('workshopEndDate').value;
    dossier.workshopDescription=this.dossierForm.get('workshopDescription').value;
    dossier.coaching=this.dossierForm.get('coaching').value;
    dossier.certification=this.dossierForm.get('certification').value;
    dossier.certificationId=this.dossierForm.get('certificationId').value;
    dossier.appointments=this.dossierForm.get('appointments').value;
    dossier.performedAppointments=this.dossierForm.get('performedAppointments').value;
    dossier.appointmentsObservation=this.dossierForm.get('appointmentsObservation').value;
    dossier.certificationPassword=this.dossierForm.get('certificationPassword').value;
    dossier.coach=this.dossierForm.get('coach').value
    dossier.userId=localStorage.getItem('id')
    this.ds.addFolder('http://localhost:3002/dossier/',dossier).subscribe((data:any)=>{
      this.getAllData(data);this.nb_dossier=this.data.length;
    })
    this.show=false
    this.selectionner(0)
    this.revenir()
  }
  getFormerFolder(d){
    this.SingleData=d
    this.setFolderForm(d)
    this.ajouter(true)
  }
  getFolderToUpdate(data){
    this.dossier = data.dossier
    this.client=data.client[0]
    this.SingleData=data
   // this.getFilesFromFolder(data.dossier)
  }
  updateDossier(){
    let dossier=this.SingleData.dossier
    dossier.civility=this.dossierForm.get('civility').value;
    dossier.firstName=this.dossierForm.get('firstName').value;
    dossier.lastName=this.dossierForm.get('lastName').value;
    dossier.dateOfBirth=this.dossierForm.get('dateOfBirth').value;
    dossier.email=this.dossierForm.get('email').value;
    dossier.mobile=this.dossierForm.get('mobile').value;
    dossier.fixe=this.dossierForm.get('fixe').value;
    dossier.adresse=this.dossierForm.get('adresse').value;
    dossier.codePostal=this.dossierForm.get('codePostal').value;
    dossier.ville=this.dossierForm.get('ville').value;
    dossier.budgetCPF=this.dossierForm.get('budgetCPF').value;
    dossier.budgetDIF=this.dossierForm.get('budgetDIF').value;
    dossier.difDisponibility=this.dossierForm.get('difDisponibility').value;
    dossier.qualification=this.dossierForm.get('qualification').value;
    dossier.rechercheEmploi=this.dossierForm.get('rechercheEmploi').value;
    dossier.langue=this.dossierForm.get('langue').value;
    dossier.niveau=this.dossierForm.get('niveau').value;
    dossier.niveauEstimation=this.dossierForm.get('niveauEstimation').value;
    dossier.note=this.dossierForm.get('note').value;
    dossier.grammaire=this.dossierForm.get('grammaire').value;
    dossier.vocabulaire=this.dossierForm.get('vocabulaire').value;
    dossier.comprehensionOrale=this.dossierForm.get('comprehensionOrale').value;
    dossier.attentes=this.dossierForm.get('attentes').value;
    dossier.duree=this.dossierForm.get('duree').value;
    dossier.prochainesAttentes=this.dossierForm.get('prochainesAttentes').value;
    dossier.autorisation=this.dossierForm.get('autorisation').value=='true';
    dossier.estimation=this.dossierForm.get('estimation').value;
    dossier.questionsRestées=this.dossierForm.get('questionsRestées').value=='true';
    dossier.avisPasserelle=this.dossierForm.get('avisPasserelle').value;
    dossier.avisExplication=this.dossierForm.get('avisExplication').value;
    dossier.suggestions=this.dossierForm.get('suggestions').value;
    dossier.pedagogieCoach=this.dossierForm.get('pedagogieCoach').value;
    dossier.ecouteCoach=this.dossierForm.get('ecouteCoach').value;
    dossier.claireteCoach=this.dossierForm.get('claireteCoach').value;
    dossier.adj1=this.dossierForm.get('adj1').value;
    dossier.adj2=this.dossierForm.get('adj2').value;
    dossier.adj3=this.dossierForm.get('adj3').value;
    dossier.connaissance=this.stringTobool(this.dossierForm.get('connaissance').value);
    dossier.correspondanceFormation=this.stringTobool(this.dossierForm.get('correspondanceFormation').value);
    dossier.implicationStagiaire=this.stringTobool(this.dossierForm.get('implicationStagiaire').value);
    dossier.compteRenduFormation=this.dossierForm.get('compteRenduFormation').value;
    dossier.programmeVu=this.stringTobool(this.dossierForm.get('programmeVu').value);
    dossier.progressionStagiaire=this.stringTobool(this.dossierForm.get('progressionStagiaire').value);
    dossier.MontantFacture=this.dossierForm.get('MontantFacture').value;
    dossier.CoutElearning=this.dossierForm.get('CoutElearning').value;
    dossier.DateReglementElearning=this.dossierForm.get('DateReglementElearning').value;
    dossier.CoutCertification=this.dossierForm.get('CoutCertification').value;
    dossier.DateReglementCertif=this.dossierForm.get('DateReglementCertif').value;
    dossier.ElearningPaye=this.dossierForm.get('ElearningPaye').value;
    dossier.CertifPaye=this.dossierForm.get('CertifPaye').value;
    dossier.AutreCout1=this.dossierForm.get('AutreCout1').value;
    dossier.AutreCout2=this.dossierForm.get('AutreCout2').value;
    dossier.DateReglementCout1=this.dossierForm.get('DateReglementCout1').value;
    dossier.DateReglementCout2=this.dossierForm.get('DateReglementCout2').value;
    dossier.Cout1Paye=this.dossierForm.get('Cout1Paye').value;
    dossier.Cout2Paye=this.dossierForm.get('Cout2Paye').value;
    dossier.CoutCoach=this.dossierForm.get('CoutCoach').value;
    dossier.DateReglementCoach=this.dossierForm.get('DateReglementCoach').value;
    dossier.CoachPaye=this.dossierForm.get('CoachPaye').value;
    dossier.CoutVendeur=this.dossierForm.get('CoutVendeur').value;
    dossier.DateReglementVendeur=this.dossierForm.get('DateReglementVendeur').value;
    dossier.VendeurPaye=this.dossierForm.get('VendeurPaye').value;
    dossier.Factor=this.dossierForm.get('Factor').value;
    dossier.status=this.dossierForm.get('status').value;
    dossier.type=this.dossierForm.get('type').value;
    dossier.rappelGestionnaire=this.dossierForm.get('rappelGestionnaire').value;
    dossier.dateRappel=this.dossierForm.get('dateRappel').value;
    dossier.provenance=this.dossierForm.get('provenance').value;
    dossier.statusCall=this.dossierForm.get('statusCall').value;
    dossier.vendeur=this.dossierForm.get('vendeur').value;
    dossier.categorie=this.dossierForm.get('categorie').value;
    dossier.entreprise=this.dossierForm.get('entreprise').value;
    dossier.numeroEdOF=this.dossierForm.get('numeroEdOF').value;
    dossier.confidentialObservation=this.dossierForm.get('confidentialObservation').value;
    dossier.idWorkshop=this.idWorkshop
    dossier.priseEnCharge= this.dossierForm.get("priseEnCharge").value;
    dossier.workshopBeginDate=this.dossierForm.get('workshopBeginDate').value;
    dossier.workshopEndDate=this.dossierForm.get('workshopEndDate').value;
    dossier.workshopDescription=this.dossierForm.get('workshopDescription').value;
    dossier.coach=this.dossierForm.get('coach').value
    dossier.coaching=this.dossierForm.get('coaching').value;
    dossier.certification=this.dossierForm.get('certification').value;
    dossier.certificationId=this.dossierForm.get('certificationId').value;
    dossier.appointments=this.dossierForm.get('appointments').value;
    dossier.performedAppointments=this.dossierForm.get('performedAppointments').value;
    dossier.appointmentsObservation=this.dossierForm.get('appointmentsObservation').value;
    dossier.certificationPassword=this.dossierForm.get('certificationPassword').value;
    dossier.userId=localStorage.getItem('id')
    dossier.NFacturation=this.dossierForm.get("NFacturation").value
    dossier.DateFacturation=this.dossierForm.get('DateFacturation').value
    dossier.NAvoir=this.dossierForm.get('NAvoir').value
    dossier.DateAvoir=this.dossierForm.get('DateAvoir').value


    this.ds.updateFolder('http://localhost:3002/dossier/',dossier).subscribe((data:any)=>{
      this.getAllData(data,true)
    })
    this.update=false
    this.revenir()
  }
  get f() { return this.dossierForm.controls; }
  onSubmitDossier(){
    this.submitted = true;
    if (this.dossierForm.invalid) {
      this.selectWindow(0)
      return;
  }
    if(this.update){
      this.updateDossier()
    }else{
      this.ajouterDossier()
    }
    this.closeModal()
  }
  formaterDate(d){
    if(!d){
      return(null)
    }
    const date=new Date(d)
    return(date.toISOString().substring(0,10))
  }
  formaterDateTime(d){
    if(!d){
      return(null)
    }
    const date=new Date(d)
    return(date.toISOString().substring(0,19))
  }
  AffichageFormateDateTime(d){
    if(!d){
      return(null)
    }
    const date =new Date(d)
    return(date.toISOString().substring(0,10)+" à "+date.toISOString().substring(11,16))
  }
  signatureModal(){
    $("#signModal").css("display", "block");
  }
  uploadModal(){
      $("#uploadModal").css("display", "block");
  }
  documentModal(){
    $("#DocumentModal").css("display", "block");
  }
  exportModal(){
    $("#ExportModal").css("display", "block");
  }
  dossierModal(){
    $("#monDossier").css("display","block")
  }
  mailModal(){
    $("#MailModal").css("display", "block");
  }
  closeModal(){
    $(".modal").css("display", "none");
    this.selectWindow(0);
    this.submitted=false
    this.searchFormation=""
    this.dossierForm.reset()
  }
  uploadForm=new FormGroup({
    avatar:new FormControl(),
    _id:new FormControl(),
    taille:new FormControl(),
  })
  files:any[]=[]
  getFiles(){
  var files =$('#formFileMultiple')[0].files
    for(let file of files ){
      this.files.unshift(file)
    }
  }
 

  folderFiles=[]
  client={
    firstName: "",
    lastName:"",
    email:""
  }
  nb_files=[]
  getFilesFromFolder(d,f){
    this.ds.getFolder('http://localhost:3002/dossier/uploads/'+d._id)
    .subscribe((data:any)=>{
      f.files=data
    })

  }
  showLimitModal(){
    $("#showLimitModal").css("display", "block");
  }
  showSignatureModal()
  {
    $("#showSignatureModal").css("display", "block");
  }
  uploadedFile
  getUploadedFile(file){
    this.uploadedFile=file
  }
  VerifFinished(done:boolean){
    let file={
      type:this.uploadedFile?.type,
      name:this.uploadedFile?.name,
      DateCreation:this.uploadedFile?.lastModified,
      taille:this.uploadedFile?.size
    }
    if(done){
      this.SingleData.files.unshift(file)
    }
    else{
      alert("Votre fichier depass les 20Mo autorisé")
    }
  }
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  downloadFile(f){
    let file ={
      name: f.name,
      type:f.type
    }
    this.downs.downloadFile('http://localhost:3002/downloads/singleFile',file).toPromise().then(blob=>{
      saveAs(blob)
    })
  }
  downloadAllFiles(){
    let files={files:[]}
    let names=[]
    this.SingleData.files.forEach(file=>{
      names.unshift(file.name)
    })
    files.files=names
    this.downs.download('http://localhost:3002/downloads',files).toPromise().then(blob=>{
      saveAs(blob)
    })
  }
  deleteFile(f){
    const data={
      file:f.name,
      file_id:f._id,
      _id:this.dossier._id
    }
    this.ds.addFolder('http://localhost:3002/dossier/uploads',data).subscribe((data:any)=>{
      let index =this.SingleData.files.indexOf(f,0)
      this.SingleData.files.splice(index,1)
    })
  }
  supprimerDossier(data){
    this.ds.deleteFolder('http://localhost:3002/dossier/'+data.dossier._id).subscribe(()=>{
        let index=this.data.indexOf(data,0)
        this.data.splice(index,1)
    }
    )
  }
  emailForm=new FormGroup({
    subject: new FormControl(''),
    message: new FormControl(''),
  })
  createItem(){
    return(new FormControl)
  }
  MailForm = new FormGroup({
    userChecked: new FormArray([
      
    ])
  })
  mail=[]
  getReceivermails(event,u){
    if(event.target.checked){
      this.mail.unshift(u.email)
    }
    else{
      let index = this.mail.indexOf(u.mail,0)
      this.mail.splice(index,1)
    }

  }
  getCommMail(f){
    this.ss.getSetting('http://localhost:3002/parameters/communication').subscribe((data:any)=>{
      f.commMail=data
    })
  }
  sendEmail(){
    let id =this.settings[0][0]?.email_communication
    let commMail = this.data[0].commMail.filter(mail=>mail._id===id)
    console.log(this.data[0].commMail)
    let mail={
      subject:"Message envoyé à partir de dossier",
      receivermails:this.mail,
      message:this.emailForm.get('message').value,
      senderEmail:commMail[0].login,
      senderpassword:commMail[0].password,
    }
    /*this.ms.sendMail('http://localhost:3002/email/text',mail).subscribe((data:any)=>{
    })*/
  }
   expor = new FormControl()
  exportData(){
    const val = this.expor.value
    let data={
      dossierId:[this.dossiers[0]._id],
      dossierAttributes:["workshopBeginDate","workshopEndDate","workshopDescription"],
      clientAttributes:["firstName","lastName","email"],
      factureAttributes:["NFacturation","MontantFacture"],
      workshopAttributes:["intitule"]
    }
    switch (val){
      case "1": this.es.getExport('http://localhost:3002/export/exportdata',data).toPromise().then(blob=>{
        saveAs(blob)
      })
      case "2": this.es.getExport('http://localhost:3002/export/exportdataMSC',data).toPromise().then(blob=>{
        saveAs(blob)
      })
      case "3": this.es.getExport('http://localhost:3002/export/exportdata/rapportFactor',data).toPromise().then(blob=>{
        saveAs(blob)
      })

    }
  }
  settings=[]
  getSetting(){
    this.ss.getSetting('http://localhost:3002/parameters/').subscribe((data:any)=>{
      this.settings.unshift(data)
    })
  }
  formaterNull(d){
    if(d==null){
      return('')
    }
    else{
      return(d.toString())
    }
  }
  path
  swichDoc(i,d){
    if(i==1){
      //this.path="assets/documents/1erDocumentTemplate.pdf"
      this.path=d
    }else{
      this.path=d
      //this.path="assets/documents/2emeDocumentTemplate.pdf"
    }
    
  }
  fillpdf(){
    let d=this.SingleData?.dossier
    let c=this.SingleData?.client[0]
    let f=this.SingleData?.formation[0]
    let evalu=this.SingleData?.evalu[0]
    let crcoach=this.SingleData?.crcoach[0]
    let data={
      dossier_Id:d._id,
      client: this.formaterNull(c?.firstName+""+c?.lastName),
      intitule:this.formaterNull(f?.intitule),
      region:this.formaterNull(this.settings[0][0]?.region),
      today:this.AffichageFormateDateTime(new Date()),
      organisme:this.formaterNull(this.settings[0][0]?.societe),
      coordOrganisme:this.formaterNull(this.settings[0][0]?.societe+" - "+this.settings[0][0]?.adresse+" "+this.settings[0][0]?.region+" - "+this.settings[0][0]?.SAS+" - "+this.settings[0][0]?.mail+" - "+this.settings[0][0]?.url+" - Tel: "+this.settings[0][0]?.telephone+" N° DA-"+this.settings[0][0]?.NDeclaration_activite+" - SIRET - "+this.settings[0][0]?.siret+" - CODE NAF "+this.settings[0][0]?.code_NAF),
      directeur:this.formaterNull(this.settings[0][0]?.representant),
      entrepriseClient:this.formaterNull(d?.entreprise),
      beginDate:this.formaterNull(d?.workshopBeginDate),
      endDate:this.formaterNull(d?.workshopEndDate),
      duree:this.formaterNull(f?.Duree),
      attentes1:this.formaterNull(evalu?.attentes[0]),
      attentes2:this.formaterNull(evalu?.attentes[1]),
      attentes3:this.formaterNull(evalu?.attentes[2]),
      attentes4:this.formaterNull(evalu?.attentes[3]),
      deroulement:this.formaterNull(evalu?.duree),
      prochainesAttentes:this.formaterNull(evalu?.prochainesAttentes),
      autorisation:this.formaterNull(evalu?.autorisation),
      estimation:this.formaterNull(evalu?.estimation),
      questionsRestées:this.formaterNull(evalu?.questionsRestées),
      avisPasserelle:this.formaterNull(evalu?.avisPasserelle),
      avisExplication:this.formaterNull(evalu?.avisExplication),
      suggestions:this.formaterNull(evalu?.suggestions),
      connaissance:this.formaterNull(crcoach?.connaissance),
      correspondanceFormation:this.formaterNull(crcoach?.correspondanceFormation),
      implicationStagiaire:this.formaterNull(crcoach?.implicationStagiaire),
      programmeVu:this.formaterNull(crcoach?.programmeVu),
      progressionStagiaire:this.formaterNull(crcoach?.progressionStagiaire),
  //PDF Document 2
      reference:this.formaterNull(f?.reference),
      Objectifs:this.formaterNull(f?.Objectifs),
      Prerequis:this.formaterNull(f?.Prerequis),
      certification:this.formaterNull(f?.certification),
      public:this.formaterNull(f?.public),
      website:this.formaterNull(f?.UrlCertification),
      organismeMail:this.formaterNull(this.settings[0][0]?.mail),
      num_activite:this.formaterNull(this.settings[0][0]?.NDeclaration_activite),
      organismeTel:this.formaterNull(this.settings[0][0]?.telephone),
      siret:this.formaterNull(this.settings[0][0]?.siret),
      NAF:this.formaterNull(this.settings[0][0]?.code_NAF),
      adresseOrganisme:this.formaterNull(this.settings[0][0]?.adresse),
      Contenu:this.formaterNull(f?.contenu),
      modalitePedagogique:this.formaterNull(f?.modalitePedagogique),
      adresse:this.formaterNull(c?.adresse),
      DateDebut:this.formaterNull(d?.workshopBeginDate),
      prixAction:this.formaterNull(d?.MontantFacture),
    }
    this.pdfs.fillPdf("http://localhost:3002/pdf/fill",data).subscribe(); 
  }
  getFilledPdf(i){
    let id="filledPDF"+i+this.SingleData.dossier._id
    this.pdfs.getPdf('http://localhost:3002/pdf/filledPdf/'+id).subscribe((data:any)=>{
      this.swichDoc(i,data)
    })
  }
  getFilledFilesFromFolder(id,f){
    this.ds.getFolder("http://localhost:3002/dossier/filledFiles/"+id).subscribe((data:any)=>{
      f.filledFiles=data
    })
  }
  firstDoc= new FormControl(false)
  secondDoc= new FormControl(false)
  async sendFilledpdf(){
    let user:any
    let filledFiles = this.SingleData?.filledFiles
    user = await this.us.getUser("http://localhost:3002/user/"+localStorage.getItem('id')).toPromise()
    let filenames=[]
    let pdf1="filledPDF1"
    let pdf2="filledPDF2"
    if(this.firstDoc.value){
      filledFiles.forEach(file => {
        if(file.name.includes(pdf1)){
          filenames.unshift(file.name)
        }
      });
    }
    else{
      filenames.forEach(file => {
        if(file.includes(pdf1)){
          let index =filenames.indexOf(file.name,0)
          filenames.splice(index,1)
        }
      });
    }
    if(this.secondDoc.value){
      filledFiles.forEach(file => {
        if(file.name.includes(pdf2)){
          filenames.unshift(file.name)
        }
      });
    }    else{
      filenames.forEach(file => {
        if(file.includes(pdf2)){
          let index =filenames.indexOf(file.name,0)
          filenames.splice(index,1)
        }
      });
    }
    let id =this.settings[0][0]?.email_communication
    let commMail = this.SingleData.commMail.filter(mail=>mail._id===id)
    console.log(commMail)
    let data ={
      dossier_Id:this.SingleData.dossier._id,
      receivermails:this.client.email,
      senderEmail:commMail[0].login,
      senderpassword:commMail[0].password,
      filenames:filenames,
      userId:localStorage.getItem('id'),
      userName: user[0].lastname+" "+user[0].name,
      port:commMail[0].port,
      host:commMail[0].host,
    }
    alert("Mail envoyé !!")
    this.ms.sendMail('http://localhost:3002/email/signdocemail',data).subscribe()
  }

  clientTosign
  getClientToSign(client){
    this.clientTosign=client
    this.email=client.email
  }
  email=""
  async signer(){
    console.log(this.email)
    let user:any
    let filledFiles = this.SingleData?.filledFiles
    user = await this.us.getUser("http://localhost:3002/user/"+localStorage.getItem('id')).toPromise()
    let filenames=[]
    let pdf1="filledPDF1"
    let pdf2="filledPDF2"
    if(this.firstDoc.value){
      filledFiles.forEach(file => {
        if(file.name.includes(pdf1)){
          filenames.unshift(file.name)
        }
      });
    }
    else{
      filenames.forEach(file => {
        if(file.includes(pdf1)){
          let index =filenames.indexOf(file.name,0)
          filenames.splice(index,1)
        }
      });
    }
    if(this.secondDoc.value){
      filledFiles.forEach(file => {
        if(file.name.includes(pdf2)){
          filenames.unshift(file.name)
        }
      });
    }    else{
      filenames.forEach(file => {
        if(file.includes(pdf2)){
          let index =filenames.indexOf(file.name,0)
          filenames.splice(index,1)
        }
      });
    }

    let data =new Signature
    data.from_email="ahmed.bouachir.05@gmail.com";
    data.signers =[{'email':this.email}];
    data.fileName=filenames
    data.dossier_Id=this.SingleData.dossier._id
    data.userId=localStorage.getItem('id')
    data.userName= user[0].lastname+" "+user[0].name
    data.clientMail=this.email
    data.clientMobile=this.clientTosign.mobile


    //data.file_from_url=this.url + filenames[0]
    this.sign.signerDoc("http://localhost:3002/signature/quickReq",data).subscribe()
    alert("document envoyer à "+this.email)
  }
  signaturesInfo=[]
  showLink=true
 async getInfoSignature(){
  let pdf1="filledpdf1"
   this.signaturesInfo=[]

    let dossier={
      dossier_Id:this.SingleData.dossier._id
    }
    let uuid={
      uuid:"",
    }
    this.sign.signerDoc("http://localhost:3002/signature/dossierSign",dossier).subscribe((data:any)=>{
      data.forEach(d=>{  
        let signatureInfo={
          date:"",
          liens:"",
          showlink:true,
          documents:"",
          status:"",
          mail:"",
          mobile:"",
        }  
        uuid.uuid=d.signatureInfo.uuid
      this.sign.getUrl("http://localhost:3002/signature/documents/signedUrl",uuid).subscribe((data:any)=>{
        signatureInfo.liens=data
        if(signatureInfo.liens==""){
          signatureInfo.showlink=false
        }
      })
        signatureInfo.date=d.signatureObject.updatedAt
        if(d.signatureInfo.name.includes(pdf1)){
        signatureInfo.documents="1er Document"
        }else{
          signatureInfo.documents="2eme Document"
        }
        if(d.signatureInfo.status=="si"){
          signatureInfo.status="Signé"
        }else if(d.signatureInfo.status=="vi"){
          signatureInfo.status="Vue"
        }else{
          signatureInfo.status="En attente"
        }
        signatureInfo.mail=d.signatureObject.clientMail
        signatureInfo.mobile=d.signatureObject.clientMobile
        this.signaturesInfo=this.signaturesInfo.concat(signatureInfo)
      })

    })
  }
  downloadSignedDoc(s){
    //let pdfUrl=s.liens
    let pdfUrl="https://signrequest-pro.s3.amazonaws.com/original_pdfs/2021/06/03/f35331aa87bc3b760796c2503ffb3cecddfa64c5/filledpdf160b64a661b41802914651f68.pdf?AWSAccessKeyId=AKIAIFC5SSMNRPLY3AMQ&Signature=YvBqumcAlcZzgHeLya7V9Byv9I8%3D&Expires=1622794130"
    let pdfName=s.documents
    FileSaver.saveAs(pdfUrl, pdfName);
  }
  filterForm = new FormGroup({
    provenances: new FormControl([]),
    vendeurs: new FormControl([]),
    call: new FormControl([]),
    dossier: new FormControl([]),
    type: new FormControl([]),
    formation: new FormControl([]),
    paye: new FormControl([]),
    CreationDateMin: new FormControl([]),
    CreationDateMax: new FormControl([]),
    workshopBeginDateMin: new FormControl([]),
    workshopBeginDateMax: new FormControl([]),
    workshopEndDateMin: new FormControl([]),
    workshopEndDateMax: new FormControl([]),
    dateFacturationMax: new FormControl([]),
    dateFacturationMin: new FormControl([]),


  })
  getVendeurName(){
    let names=[]
    if(this.filterForm.get("vendeurs").value){
    this.filterForm.get("vendeurs").value.forEach(v=>{
      names.unshift(v.substr(0,v.indexOf(' ')))
    })
    if(names.length==0){
      return(null)
    }
    return names
  }else{
    return null
  }
  }
  formaterArray(a){
    if(a){
    if (a.length==0){
      return null
    }else{
      return a
    }
  }else{
    return null
  }
  }
  filterVendeurPayé(v){
    let value =["Vendeur payé","Vendeur non payé"]
    let vendeurPaye=[false,false]
    if(!v){
      return null
    }
    v.forEach(el => {
      if(el == value[0]){
        vendeurPaye[0]=true
      }
      else if(el==value[1]){
        vendeurPaye[1]=true
      }

    });
    if((vendeurPaye[0]==true) && (vendeurPaye[1]==false)){
      return true
    }else if((vendeurPaye[1]==true) && (vendeurPaye[0]==false)){
      return false
    }else{
      return null
    }
  }
  filterCoachPayé(v){
    let value =["Coach payé","Coach non payé"]
    if(!v){
      return null
    }
    let CoachPaye=[false,false]
        v.forEach(el => {
        if(el==value[0]){
          CoachPaye[0]=true
        }
        else if(el==value[1]){
          CoachPaye[1]=true
        }
      })
      if(CoachPaye[0]==true && CoachPaye[1]==false){
        return true
      }else if(CoachPaye[1]==true && CoachPaye[0]==false){
        return false
      }else{
        return null
      }
  }
  filterData(){
    let data ={
      provenances:this.formaterArray(this.filterForm.get("provenances").value),
      vendeurs:this.getVendeurName(),
      call:this.formaterArray(this.filterForm.get("call").value),
      statusDossier:this.formaterArray(this.filterForm.get("dossier").value),
      types:this.formaterArray(this.filterForm.get("type").value),
      workshops:this.formaterArray(this.filterForm.get("formation").value),
      payementCoach:this.filterCoachPayé(this.formaterArray(this.filterForm.get("paye").value)),
      payementVendeur:this.filterVendeurPayé(this.formaterArray(this.filterForm.get("paye").value)),
      CreationDateMin:this.formaterArray(this.filterForm.get("CreationDateMin").value),
      CreationDateMax:this.formaterArray(this.filterForm.get("CreationDateMax").value),
      workshopBeginDateMin:this.formaterArray(this.filterForm.get("workshopBeginDateMin").value),
      workshopBeginDateMax:this.formaterArray(this.filterForm.get("workshopBeginDateMax").value),
      workshopEndDateMin:this.formaterArray(this.filterForm.get("workshopEndDateMin").value),
      workshopEndDateMax:this.formaterArray(this.filterForm.get("workshopEndDateMax").value),
      dateFacturationMax:this.formaterArray(this.filterForm.get("workshopEndDateMax").value),
      dateFacturationMin:this.formaterArray(this.filterForm.get("dateFacturationMin").value),

    }

    this.filter.filter('http://localhost:3002/filters',data).subscribe((data:any)=>{
      let folder 
      this.data=[]
      data.forEach(d => {
        folder=d
        folder.facturation=d.facturation._id
        folder.idWorkshop=d.idWorkshop._id
        folder.vendeur=d.vendeur._id
        folder.provenance=d.provenance._id
        folder.client=d.client._id
        this.getAllData(folder)
      });
    })
  }
  formaterFilter(){
    this.filterForm.reset()
  }
  selectWindow(id){
    let i=0
    for(let s of this.shows){
      this.shows[i]=false
      $("#nav-tab > button:nth-child("+(i+1)+")").attr('class','nav-link')
      i++
    }
    this.shows[id]=true
    $("#nav-tab > button:nth-child("+(id+1)+")").attr('class','nav-link active')
  }
  select=[true,false]
  selectFilter(id){
    let i=0
    for(let s of this.shows){
      this.select[i]=false
      $("#nav-tab > button:nth-child("+(i+1)+")").attr('class','nav-link')
      i++
    }
    this.select[id]=true
    $("#nav-tab > button:nth-child("+(id+1)+")").attr('class','nav-link active')
  }
  fixMinDate(){
    var minDate=this.dossierForm.get("workshopBeginDate").value
    $("#endDate").attr('min',minDate)
    if(minDate>this.dossierForm.get("workshopEndDate").value){
      this.dossierForm.get("workshopEndDate").patchValue(minDate)
    }
  }
  activateRemise(){
    var arrayControl = this.dossierForm.get('priseEnCharge') as FormArray;
    if(this.dossierForm.get("priseEnCharge").value[0]){
      arrayControl.at(3).enable()
    }
    else{
      arrayControl.at(3).disable()
      arrayControl.at(3).setValue(0)
    }
    if(this.dossierForm.get("priseEnCharge").value[1]){
      arrayControl.at(4).enable()
    } else{
      arrayControl.at(4).disable()
      arrayControl.at(4).setValue(0)
    }
    if(this.dossierForm.get("priseEnCharge").value[2]){
      arrayControl.at(5).enable()
    } else{
      arrayControl.at(5).disable()
      arrayControl.at(5).setValue(0)
    }
  }
  fixMinDateFact(){
    var minDate=this.filterForm.get("dateFacturationMin").value
    $("#dateFacturationMax").attr('min',minDate)
    if(minDate>this.filterForm.get("dateFacturationMax").value){
      this.filterForm.get("dateFacturationMax").patchValue(minDate)
    }
  }
  fixMinDateForm(){
    var minDate=this.filterForm.get("workshopEndDateMin").value
    $("#workshopEndDateMax").attr('min',minDate)
    if(minDate>this.filterForm.get("workshopEndDateMax").value){
      this.filterForm.get("workshopEndDateMax").patchValue(minDate)
    }
  }
  fixMinDateFormB(){
    var minDate=this.filterForm.get("workshopBeginDateMin").value
    $("#workshopBeginDateMax").attr('min',minDate)
    if(minDate>this.filterForm.get("workshopBeginDateMax").value){
      this.filterForm.get("workshopBeginDateMax").patchValue(minDate)
    }
  }
  fixMinDateCrea(){
    var minDate=this.filterForm.get("CreationDateMin").value
    $("#CreationDateMax").attr('min',minDate)
    if(minDate>this.filterForm.get("CreationDateMax").value){
      this.filterForm.get("CreationDateMax").patchValue(minDate)
    }
  }
  p=1
  injectPaginationStyle(){
    $('.ngx-pagination').css("width","max-content")
    $('.ngx-pagination').css("float","right")
    $('.ngx-pagination').css("margin-top","2%")
    //$('.ngx-pagination li').attr('style','  width: 6.277vw;height: 2.263vw;margin: 1.752vw 0.657vw 4.38vw 5.182vw;padding: 0.511vw 1.168vw 0.584vw;border-radius: 4px;border: solid 1px #f5f5f5;background-color: #ffffff;')
    $('.ngx-pagination .current').toggleClass('changed')
    $('.pagination-next ::after').css('display','none')
  }
  views=[true,false]
  changeView(view){
    console.log(view)
    if(view==0){
      this.views[0]=true;
      this.views[1]=false;
      setTimeout(()=>{
        this.injectPaginationStyle()
      },20)
    }else{
      this.views[0]=false;
      this.views[1]=true;
    }
  }
}
