import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { OauthComponent } from './features/oauth/oauth.component';
import { NavbarComponent } from "./features/navbar/navbar.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [CommonModule, RouterOutlet, OauthComponent, HttpClientModule, NavbarComponent]
})
export class AppComponent {
  title = 'parcial3fe';
  loggedIn : any;

  token = localStorage.getItem("token");

  ngOnInit(): void {

    if(this.token!=null && this.token!=undefined){
      this.loggedIn = true;
    }
  }
}
