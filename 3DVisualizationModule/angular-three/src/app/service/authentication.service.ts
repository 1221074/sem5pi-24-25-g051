import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  mail: string | null = null;


  getMailSession() {return this.mail;}

  constructor(private router: Router) {
    this.mail = localStorage.getItem('mail');
  }

  logout() {

    if (this.mail) {
      google.accounts.id.revoke(this.mail, (done: any) => {
        console.log(`User ${this.mail} has been logged out of Google.`);
      });
    } else {
      console.warn('No email provided for logout.');
    }


    // Clear all stored data
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to login
    this.router.navigate(['/']);
  }

  updateMail(mail: string) {
    this.mail = mail;
  }
}
