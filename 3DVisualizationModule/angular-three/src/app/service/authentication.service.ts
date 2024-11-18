import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../interface/user';
import { jwtDecode } from 'jwt-decode';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  getUserRole() {
    return this.userRole;
  }
  url1 = 'https://vs1438.dei.isep.ipp.pt:7252/api/user/email';

  mail: string | null = null;
  userId: string | null = null;
  userRole: string | null = null;


  getMailSession() {return this.mail;}

  constructor(private router: Router) {
    const token = localStorage.getItem('token') as any;
    if(token != null) {
      const decodedToken =  jwtDecode(token) as any;
      this.updateUserInformation(decodedToken.email);
    }
  }


  logout() {
      localStorage.clear();
      this.mail = null;
      this.userId = null;
    // Redirect to login
    this.router.navigate(['/']);
  }

  updateUserInformation(mail: string) {
    this.mail = mail;
    console.log('Mail:', this.mail);

    //get the user id from the mail it's store in a http get request
    this.getUserByMail(mail).then((user: User) => {
      if (user) {
        this.userId = user.nif;
        this.userRole = user.role.toString();
        console.log('User ID:', this.userId);
      } else {
        console.error(`User not found for email ${mail}`);
      }
    });
}

  private async getUserByMail(mail: string): Promise<User> {
    const data = await fetch(`${this.url1}/${mail}`);
        return await data.json() ?? [];
  }
}
