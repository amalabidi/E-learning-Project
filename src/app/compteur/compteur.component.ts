import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, FormArray, Validators } from '@angular/forms';
import { CompteurService } from '../services/CompteurService/compteur.service'
@Component({
  selector: 'app-compteur',
  templateUrl: './compteur.component.html',
  styleUrls: ['./compteur.component.css']
})
export class CompteurComponent implements OnInit {
  nb_sign=0
  constructor(private cs:CompteurService) { }
  coutForm = new FormGroup({
      beginDate : new FormControl(""),
      endDate : new FormControl(""),
  })
  ngOnInit(): void {
    this.submit()
  }
  submit(){
    let data={
      beginDate:this.coutForm.get('beginDate').value,
      endDate:this.coutForm.get('endDate').value
    }
    this.cs.getCount('http://localhost:3002/compteur',data).subscribe((data:any)=>{
      this.nb_sign=data.consommation
    })
  }

}
