import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-security',
  template: `<div id="google-enter"></div>`,
  styles: [],
})
export class SecurityComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    google.accounts.id.initialize({
      auto_select: true,
      client_id:
        '131910832628-jjauecr970l1u0pp0g6123r8ejtu3im3.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
    });

    google.accounts.id.renderButton(document.getElementById('google-enter')!, {
      text: 'signin',
      type: 'standard',
      theme: 'outline',
      size: 'large',
    });
  }

  private handleCredentialResponse(
    response: google.accounts.id.CredentialResponse
  ): void {
    console.log('handleCredentialResponse', this.parseJwt(response.credential));
  }

  private parseJwt(jwt: string): UserInfo {
    var base64Url = jwt.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }
}

export interface UserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  // Full Name
  name: string;
  // Image URL
  picture: string;
  // Given Name
  given_name: string;
  //date
  nbf: number;
  //date
  iat: number;
  //date
  exp: number;
}
