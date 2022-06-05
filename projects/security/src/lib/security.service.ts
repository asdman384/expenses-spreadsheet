import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// TODO: make SecurityModule.forRoot()
const CLIENT_ID =
  '131910832628-jjauecr970l1u0pp0g6123r8ejtu3im3.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

@Injectable({ providedIn: 'root' })
export class SecurityService {
  private client!: google.accounts.oauth2.TokenClient;

  readonly token$: Subject<google.accounts.oauth2.TokenResponse> =
    new Subject<google.accounts.oauth2.TokenResponse>();

  async init(): Promise<void> {
    this.initAuthLib();
    this.auth();
  }

  private initAuthLib(): void {
    this.client = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (token: google.accounts.oauth2.TokenResponse) => {
        if (token.error) alert('SecurityService: ' + token.error);
        this.token$.next(token);
        this.setStoredToken(token);
      },
    });
  }

  private auth(): void {
    const token = this.getStoredToken();
    if (!token) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      this.client.requestAccessToken({});
      return;
    }

    // Skip display of account chooser and consent dialog for an existing expired session.
    if (Date.now() > token.expiration) {
      this.client.requestAccessToken({ prompt: 'none' });
      return;
    }

    this.token$.next(token.googleToken);
  }

  private getStoredToken(): Token | false {
    const textToken = sessionStorage.getItem('token');
    return textToken !== null && (JSON.parse(textToken) as Token);
  }

  private setStoredToken(token: google.accounts.oauth2.TokenResponse): void {
    sessionStorage.setItem('token', JSON.stringify(new Token(token)));
  }
}

class Token {
  expiration: number;
  constructor(public googleToken: google.accounts.oauth2.TokenResponse) {
    this.expiration =
      Date.now() + Number(googleToken.expires_in) * 1000 - 60_000;
  }
}
