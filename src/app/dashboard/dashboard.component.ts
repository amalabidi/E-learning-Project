import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/DashboardService/dashboard.service'
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit,AfterViewInit {

  constructor(private ds:DashboardService) { }
  data=[]
  ngOnInit(): void {
    this.getData()
  }
 async ngAfterViewInit(){

  }
  getData(){
    this.ds.getDashboard('http://localhost:3002/dashboard').subscribe((data:any)=>{
        this.data=data
    })
  }
}
