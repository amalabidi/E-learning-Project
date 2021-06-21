import { Component } from '@angular/core';
import { RouterOutlet,Router, NavigationStart } from '@angular/router';
import { slider } from './route-animations'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations:[
    slider
  ]
})
export class AppComponent {
  showMenu=false
  constructor(private router:Router){
    router.events.forEach((event) => {
      if(event instanceof NavigationStart) {
          this.showMenu = event.url !== "/login";
      }
    });
  }
  title = 'CRM';
  prepareRoute(outlet:RouterOutlet){
    return (outlet && outlet.activatedRouteData && outlet.activatedRouteData["animation"])
  }
}
