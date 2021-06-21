import { NgModule } from '@angular/core';
import { Routes, RouterModule,CanActivate  } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DossierComponent } from './dossier/dossier.component';
import { PlanningComponent } from './planning/planning.component';
import { ProvenanceComponent } from './provenance/provenance.component';
import { SuiviModifComponent } from './suivi-modif/suivi-modif.component';
import { UserComponent } from './user/user.component';
import { FormationComponent } from './formation/formation.component';
import { BpfComponent } from './bpf/bpf.component';
import { CoutComponent } from './cout/cout.component';
import { ImportLeadsComponent } from './import-leads/import-leads.component';
import { ImportIpbxComponent } from './import-ipbx/import-ipbx.component';
import { CompteurComponent } from './compteur/compteur.component';
import { RelanceComponent } from './relance/relance.component';
import { SttingsComponent } from './sttings/sttings.component';
import { LoginComponent } from './login/login.component';
import {  AuthGuardService as AuthGuard } from './services/AuthService/auth-guard.service';

const routes: Routes = [
  { path: '',
  redirectTo: '/login',
  pathMatch: 'full'
  },
  { path: 'tableau-de-bord', component: DashboardComponent, canActivate: [AuthGuard] ,data:{animation:'tdb'}},
  { path: 'dossier', component: DossierComponent, canActivate: [AuthGuard] ,data:{animation:'dossier'}},
  { path: 'planning', component: PlanningComponent, canActivate: [AuthGuard] ,data:{animation:'plan'}},
  { path: 'provenance', component: ProvenanceComponent, canActivate: [AuthGuard] ,data:{animation:'prov'}},
  { path: 'suivi-modification', component: SuiviModifComponent, canActivate: [AuthGuard] ,data:{animation:'sm'}},
  { path: 'utilisateur', component: UserComponent, canActivate: [AuthGuard] ,data:{animation:'user'}},
  { path: 'formation', component: FormationComponent, canActivate: [AuthGuard] ,data:{animation:'formation'}},
  { path: 'bpf', component: BpfComponent, canActivate: [AuthGuard] ,data:{animation:'bpf'}},
  { path: 'couts', component: CoutComponent, canActivate: [AuthGuard] ,data:{animation:'couts'}},
  { path: 'import-leads', component: ImportLeadsComponent, canActivate: [AuthGuard] ,data:{animation:'leads'}},
  { path: 'import-ipbx', component: ImportIpbxComponent, canActivate: [AuthGuard] ,data:{animation:'ipbx'}},
  { path: 'compteur', component: CompteurComponent, canActivate: [AuthGuard] ,data:{animation:'compteur'}},
  { path: 'relance', component: RelanceComponent, canActivate: [AuthGuard] ,data:{animation:'relance'}},
  { path: 'parametre', component: SttingsComponent, canActivate: [AuthGuard] ,data:{animation:'params'}},
  { path: 'login', component: LoginComponent ,data:{animation:'login'}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload',
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
