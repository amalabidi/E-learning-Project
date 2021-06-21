import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SettingService } from '../services/SettingsService/setting.service'
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-sttings',
  templateUrl: './sttings.component.html',
  styleUrls: ['./sttings.component.css']
})
export class SttingsComponent implements OnInit,AfterViewInit {
  settingsForm:FormGroup
  settings
  commMail 
  relanceMail 
  princBanc 
  factorBanc
  data
  logo
  cachet
  constructor(private ss:SettingService) { }

  ngOnInit(): void {
    this.getSettings()
    this.settingsForm=this.createSettingsForm()
  }
  async ngAfterViewInit(){
    this.settings=await this.getSettings()
    this.princBanc=await this.getPrincBanc()
    this.factorBanc=await this.getPrincBanc()
    this.relanceMail=await this.getRelanceMail()
    this.commMail=await this.getCommMail()
    let commEmail=this.commMail.filter(client=>client._id===this.settings[0].email_communication)
    this.data={
      settings:this.settings,
      princBanc:this.princBanc,
      factorBanc:this.factorBanc,
      commMail:commEmail,
      relanceMail:this.relanceMail,
    }
    this.setSettings()
    console.log(this.data)
    this.cachet=this.settings[0].cachet
    this.logo=this.settings[0].logo
  }
  createSettingsForm(){
    let settingsForm=new FormGroup({
      portComm:new FormControl(''),
      hostComm:new FormControl(''),
      loginComm:new FormControl(''),
      passwordComm:new FormControl(''),
      portRel:new FormControl(''),
      hostRel:new FormControl(''),
      loginRel:new FormControl(''),
      passwordRel:new FormControl(''),
      nomprincip:new FormControl(''),
      NBICprincip:new FormControl(''),
      NIBANprincip:new FormControl(''),
      nomfactor:new FormControl(''),
      NBICfactor:new FormControl(''),
      NIBANfactor:new FormControl(''),
      representant:new FormControl(''),
      societe:new FormControl(''),
      telephone:new FormControl(''),
      mail:new FormControl(''),
      url:new FormControl(''),
      adresse:new FormControl(''),
      code_postal:new FormControl(''),
      ville:new FormControl(''),
      siret:new FormControl(''),
      SAS:new FormControl(''),
      RCS:new FormControl(''),
      TVA_infra:new FormControl(''),
      NDeclaration_activite:new FormControl(''),
      code_NAF:new FormControl(''),
      forme_juridique:new FormControl(''),
      region:new FormControl(''),
    })
    return(settingsForm)
  }
  getSettings(){
    return(this.ss.getSetting('http://localhost:3002/parameters/').toPromise())
 
  }
  getCommMail(){
    return(this.ss.getSetting('http://localhost:3002/parameters/communication').toPromise())
  }
  getRelanceMail(){
    return(this.ss.getSetting('http://localhost:3002/parameters/relance').toPromise())
  }
  getPrincBanc(){
    return(this.ss.getSetting('http://localhost:3002/parameters/principale').toPromise())
  }
  getFactorBanc(){
    return(this.ss.getSetting('http://localhost:3002/parameters/factor').toPromise())
  }
  setSettings(){
    console.log(this.data.princBanc[0])
    this.settingsForm.setValue({
      portComm:this.data.commMail[0].port,
      hostComm:this.data.commMail[0].host,
      loginComm:this.data.commMail[0].login,
      passwordComm:this.data.commMail[0].password,
      portRel:this.data.relanceMail[0].port,
      hostRel:this.data.relanceMail[0].host,
      loginRel:this.data.relanceMail[0].login,
      passwordRel:this.data.relanceMail[0].password,
      nomprincip:this.data.princBanc[0].nom,
      NBICprincip:this.data.princBanc[0].NBIC,
      NIBANprincip:this.data.princBanc[0].NIBAN,
      nomfactor:this.data.factorBanc[0].nom,
      NBICfactor:this.data.factorBanc[0].NBIC,
      NIBANfactor:this.data.factorBanc[0].NIBAN,
      representant:this.data.settings[0].representant,
      societe:this.data.settings[0].societe,
      telephone:this.data.settings[0].telephone,
      mail:this.data.settings[0].mail,
      url:this.data.settings[0].url,
      adresse:this.data.settings[0].adresse,
      code_postal:this.data.settings[0].code_postal,
      ville:this.data.settings[0].ville,
      siret:this.data.settings[0].siret,
      SAS:this.data.settings[0].SAS,
      RCS:this.data.settings[0].RCS,
      TVA_infra:this.data.settings[0].TVA_infra,
      NDeclaration_activite:this.data.settings[0].NDeclaration_activite,
      code_NAF:this.data.settings[0].code_NAF,
      forme_juridique:this.data.settings[0].forme_juridique,
      region:this.data.settings[0].region,
    })
  }
  updateSettings(){
    let data={
      portComm:"",
      hostComm:"",
      loginComm:"",
      passwordComm:"",
      portRel:"",
      hostRel:"",
      loginRel:"",
      passwordRel:"",
      nomprincip:"",
      NBICprincip:"",
      NIBANprincip:"",
      nomfactor:"",
      NBICfactor:"",
      NIBANfactor:"",
      representant:"",
      societe:"",
      telephone:"",
      mail:"",
      url:"",
      adresse:"",
      code_postal:"",
      ville:"",
      siret:"",
      SAS:"",
      RCS:"",
      TVA_infra:"",
      NDeclaration_activite:"",
      code_NAF:"",
      forme_juridique:"",
      region:"",
      _id:"",
    }
    data.portComm=this.settingsForm.get('portComm').value
    data.hostComm=this.settingsForm.get('hostComm').value
    data.loginComm=this.settingsForm.get('loginComm').value
    data.passwordComm=this.settingsForm.get('passwordComm').value
    data.portRel=this.settingsForm.get('portRel').value
    data.hostRel=this.settingsForm.get('hostRel').value
    data.loginRel=this.settingsForm.get('loginRel').value
    data.passwordRel=this.settingsForm.get('passwordRel').value
    console.log("mail pass",data.passwordRel=this.settingsForm.get('passwordRel').value)
    data.nomprincip=this.settingsForm.get('nomprincip').value
    data.NBICprincip=this.settingsForm.get('NBICprincip').value
    data.NIBANprincip=this.settingsForm.get('NIBANprincip').value
    data.NBICfactor=this.settingsForm.get('NBICfactor').value
    data.NIBANfactor=this.settingsForm.get('NIBANfactor').value
    data.representant=this.settingsForm.get('representant').value
    data.societe=this.settingsForm.get('societe').value
    data.telephone=this.settingsForm.get('telephone').value
    data.mail=this.settingsForm.get('mail').value
    data.url=this.settingsForm.get('url').value
    data.adresse=this.settingsForm.get('adresse').value
    data.code_postal=this.settingsForm.get('code_postal').value
    data.ville=this.settingsForm.get('ville').value
    data.siret=this.settingsForm.get('siret').value
    data.SAS=this.settingsForm.get('SAS').value
    data.RCS=this.settingsForm.get('RCS').value
    data.TVA_infra=this.settingsForm.get('TVA_infra').value
    data.NDeclaration_activite=this.settingsForm.get('NDeclaration_activite').value
    data.code_NAF=this.settingsForm.get('code_NAF').value
    data.forme_juridique=this.settingsForm.get('forme_juridique').value
    data.region=this.settingsForm.get('region').value
    data._id=this.data.settings[0]._id
    console.log("data",data)
    this.ss.updateSetting("http://localhost:3002/parameters/",data).subscribe((data:any)=>{
      //this.data.settings=data;
    })

  }
  onSubmitSetting(){

  }
}
