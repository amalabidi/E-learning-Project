import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule,  } from '@angular/common/http';
import { FormationComponent } from './formation/formation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NavbarComponent } from './navbar/navbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { FooterComponent } from './footer/footer.component';
import { PrefooterComponent } from './prefooter/prefooter.component';
import { UserComponent } from './user/user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlanningComponent } from './planning/planning.component';
import { ProvenanceComponent } from './provenance/provenance.component';
import { SuiviModifComponent } from './suivi-modif/suivi-modif.component';
import { BpfComponent } from './bpf/bpf.component';
import { CoutComponent } from './cout/cout.component';
import { ImportLeadsComponent } from './import-leads/import-leads.component';
import { ImportIpbxComponent } from './import-ipbx/import-ipbx.component';
import { CompteurComponent } from './compteur/compteur.component';
import { RelanceComponent } from './relance/relance.component';
import { SttingsComponent } from './sttings/sttings.component';
import { DossierComponent } from './dossier/dossier.component';
import { LoginComponent } from './login/login.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormationPipe } from './dossier/pipeFomation'
import { CommonModule } from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { UploadComponent } from './upload/upload.component'
import { DndDirective } from '../app/upload/direcitves/dnd.directive';
import { ProgressComponent } from '../app/upload/components/progress/progress.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import {NgxPaginationModule} from 'ngx-pagination';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 
import listPlugin from '@fullcalendar/list';
import { SortDirective } from './directive/sort.directive';
FullCalendarModule.registerPlugins([ 
  dayGridPlugin,
  interactionPlugin,
  listPlugin,
]);
@NgModule({
  declarations: [
    AppComponent,
    FormationComponent,
    NavbarComponent,
    SidenavComponent,
    FooterComponent,
    PrefooterComponent,
    UserComponent,
    DashboardComponent,
    PlanningComponent,
    ProvenanceComponent,
    SuiviModifComponent,
    BpfComponent,
    CoutComponent,
    ImportLeadsComponent,
    ImportIpbxComponent,
    CompteurComponent,
    RelanceComponent,
    SttingsComponent,
    DossierComponent,
    LoginComponent,
    FormationPipe,
    UploadComponent,
    DndDirective,
    ProgressComponent,
    SortDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgMultiSelectDropDownModule.forRoot(),
    CommonModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    BrowserAnimationsModule,
    NgxExtendedPdfViewerModule,
    NgxPaginationModule,
    FullCalendarModule,
  ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
