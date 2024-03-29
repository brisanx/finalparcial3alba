import { GoogleLoginProvider, GoogleSigninButtonModule, SocialAuthService, SocialLoginModule, SocialUser } from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { OauthService } from '../../services/oauth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-oauth',
  standalone: true,
  imports: [CommonModule, GoogleSigninButtonModule],
  templateUrl: './oauth.component.html',
  styleUrl: './oauth.component.css',
  providers: [OauthService]
})
export class OauthComponent{
  idToken: any;
  user: SocialUser = new SocialUser;
  loggedIn: any;
  constructor(private authService: SocialAuthService, private router: Router, private oauthService: OauthService, private httpClient: HttpClient) { }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      
      this.user = user;
      this.loggedIn = (user != null);
      if (user && user.idToken) {
        this.oauthService.verifyToken(user);
      }
    });
  }

  signOut(): void {
    this.authService.signOut();
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("photoUrl");
  }
  handleAuth(): void{
    console.log("test");
  }
}