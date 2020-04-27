import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth.service';
import { SwUpdate} from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  constructor(public auth: AuthService, private updates: SwUpdate){
    updates.available.subscribe(event => {
      updates.activateUpdate().then(() => document.location.reload());
    });
  }

  ngOnInit(){
  }

}
