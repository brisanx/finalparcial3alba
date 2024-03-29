import { Component, OnInit } from '@angular/core';
import { OauthComponent } from '../oauth/oauth.component';
import { CommonModule } from '@angular/common';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [OauthComponent, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  providers: [OauthComponent]
})
export class NavbarComponent{
  token: any = localStorage.getItem("token");
  email: any = localStorage.getItem("email")

  loggedIn = false;
  // token : any;

  constructor(private authService: SocialAuthService, private router: Router) {}

  signOut(): void{
    this.authService.signOut();
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("photoUrl");
    location.reload();
  }

  redirigirCrearGasto(): void {
    this.router.navigate(['/crearGasto']);
  }
/*
  redirigirSubirImagen(): void{
    this.router.navigate(['/imagen']);
  }

  redirigirMapa(): void{
    this.router.navigate(['/map'])
  }
*/
}