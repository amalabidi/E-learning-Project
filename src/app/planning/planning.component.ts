import { Component, OnInit,AfterViewInit,Renderer2, Inject } from '@angular/core';
import $ from 'jquery'
import { DossierService } from '../services/DossierService/dossier.service'
import { CalendarOptions } from '@fullcalendar/angular';
import frLocale from '@fullcalendar/core/locales/fr';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit, AfterViewInit {
  dossiers
  clients: any[]=[];
  client: any;
  datas=[]
  constructor(private ds: DossierService,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private _document

    ) { 


   }
   calendarOptions: CalendarOptions ={
    initialView: 'dayGridMonth',
    headerToolbar:{
      left:"prev,next today",
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    locales:[frLocale],
    locale:"fr",
    weekends: true,
    dateClick: this.handleDateClick.bind(this), // bind is important!
    events:[]
  }
  ngOnInit(): void {
    this.getDossier()
  }
  eventrender(event){
    event.element[0].querySelectorAll(".fc-content")[0].setAttribute("data-tooltip", event.event.title);
  }
  ngAfterViewInit(){
    this.getPlanningEvents()


  }
  events=[]
  getAllData(d){
    let folder={
      dossier:{
        workshopBeginDate:"",
        workshopEndDate:"",
        status:"",
        _id:"",
      },
      client:[],
    }
    let eventE={ id:"",type:'R.E',title: '', date: '',status:"" }
    let eventS={ id:"",type:'R.S',title: '', date: '',status:"" }
    folder.dossier=d
    eventE.id="e"+folder.dossier._id
    eventS.id="s"+folder.dossier._id

    eventE.status=folder.dossier.status
    eventS.status=folder.dossier.status

    eventE.date= this.formaterDate(folder.dossier.workshopBeginDate)
    eventS.date= this.formaterDate(folder.dossier.workshopEndDate)
    this.getClients(d.client,folder,eventE)
    this.getClients(d.client,folder,eventS)
    this.datas.unshift(folder)

    this.events.unshift(eventE)
    this.events.unshift(eventS)

  }
  getDossier(){
      this.ds.getFolder('http://localhost:3002/dossier').subscribe((data:any)=>{
        let i=0
        data.forEach(d=>{
          this.getAllData(d)
        })
        setTimeout(()=>{
          this.calendarOptions.events=this.events


        },500)
        setTimeout(()=>{
            //this.injectId()
              const s = this.renderer2.createElement('script');
              s.text=`$(function () {
                $('[data-toggle="tooltip"]').tooltip()
              })`;
              this.renderer2.appendChild(this._document.body, s);
          
        },700)
        
      })
  }
  getClients(id,f,event){
    this.ds.getFolder('http://localhost:3002/dossier/client/'+id).subscribe((data:any)=>{
      f.client=data
      event.title= event.type+" | "+f.client[0]?.firstName+" "+f.client[0]?.lastName
    })
  }

  handleDateClick(arg) {
    alert('date click! ' + arg.dateStr)
  }
  
  getPlanningEvents(){


  }
  injectId(){
    console.log(this.calendarOptions.events)
    let events=this.events
    $('.fc-h-event').each(function(i){
     var event = $(this).attr("id",events[i].id);
    })
    this.createTooltip()
  }
  createTooltip(){
    /*console.log(this.events)
    let tooltip=`<div class=""><h3 class="font-bold" style="color:white">Status dossier: `+this.events[i-1]?.status+`</h3><h3 class="font-bold" style="color:#da6f27">Type de RDV: `+this.events[i-1].type+`</h3><div></div>`
    console.log("dollar",$('.fc-h-event')[0])*/
    let events =this.events
    $('.fc-h-event').mouseover(function(event) {
      var ev=events.filter(e=>e.id==this.id)
      let tooltip=`<div class=""><h3 class="font-bold" style="color:white">Status dossier: `+ev[0].status+`</h3><h3 class="font-bold" style="color:#da6f27">Type de RDV: `+ev[0].type+`</h3><div></div>`
      console.log(ev);
      $(event.target).attr('data-toggle','tooltip')
        $(event.target).attr('data-html',"true")
        $(event.target).attr('title',tooltip)


   });

    /*$('.fc-h-event').hover(function(event) {
      $(document).ready(function() {
        /*$(event.target).attr('data-toggle','tooltip')
        $(event.target).attr('data-html',"true")
        $(event.target).attr('title',tooltip)
        console.log(this.id)
    })
   });*/


  }
  formaterDate(d){
    if(!d){
      return(null)
    }
    const date=new Date(d)
    return(date.toISOString().substring(0,10))
  }

}


