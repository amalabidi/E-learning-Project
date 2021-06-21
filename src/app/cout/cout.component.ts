import { Component, OnInit } from '@angular/core';
import { CoutsService } from '../services/CoutsService/couts.service'
@Component({
  selector: 'app-cout',
  templateUrl: './cout.component.html',
  styleUrls: ['./cout.component.css']
})
export class CoutComponent implements OnInit {
  searchCout
  couts=[]
  dossiers=[]
  benefice=0
  coutpaye=0
  cout=0
  couVen=0
  coutCoach=0
  cout2=0
  cout1=0
  coutCertif=0
  coutElearn=0
  constructor(private cs:CoutsService) { 

  }

  ngOnInit(): void {
    this.getCout()
  }
  getCout(){
    this.cs.getCout('http://localhost:3002/cout/').subscribe((data:any)=>{
      data.forEach(dossier => {
        this.dossiers=this.dossiers.concat(dossier)
        this.total(dossier)
      });
    })
  }
  replaceNull(d){
    if(d==null){
      return(0)
    }
    else{
      return(d)
    }
  }
  calculerTotalCout(d){
    let facture=d.facturation
    let CoutCoach:number = +this.replaceNull(facture.CoutCoach)
    let CoutElearning:number = +this.replaceNull(facture.CoutElearning)
    let CoutVendeur:number = +this.replaceNull(facture.CoutVendeur)
    let CoutCertification:number = +this.replaceNull(facture.CoutCertification)
    let AutreCout1:number = +this.replaceNull(facture.AutreCout1)
    let AutreCout2:number = +this.replaceNull(facture.AutreCout1)
    let total:number =CoutCoach+CoutElearning+CoutVendeur+CoutCertification+AutreCout1+AutreCout2
    return(total)
  }
  total(d){
    let facture = d.facturation
    let CoutCoach:number = +this.replaceNull(facture.CoutCoach)
    let CoutElearning:number = +this.replaceNull(facture.CoutElearning)
    let CoutVendeur:number = +this.replaceNull(facture.CoutVendeur)
    let CoutCertification:number = +this.replaceNull(facture.CoutCertification)
    let AutreCout1:number = +this.replaceNull(facture.AutreCout1)
    let AutreCout2:number = +this.replaceNull(facture.AutreCout1)
    let benefice:number = +this.replaceNull(facture.MontantFacture)
    let cout : number = this.calculerTotalCout(d)
    let coutpaye:number = 0
    this.benefice+=benefice
    this.coutElearn+=CoutElearning
    this.coutCertif+=CoutCertification
    this.cout1+=AutreCout1
    this.cout2+=AutreCout2
    this.coutCoach+=CoutCoach
    this.couVen+=CoutVendeur
    this.cout+=cout
    this.coutpaye+=coutpaye

  }
}
