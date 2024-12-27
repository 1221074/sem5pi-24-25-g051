import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../interface/user';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  url1 = environment.apiURL + '/user/email';

  mail: string | null = null;
  userId: string | null = null;


  getUserId() {
    return this.userId;
  }

  getToken() {
    return localStorage.getItem('token');
  }


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

  /* LOGIN WITH NODE JS ??? TAVA NOS SLIDES
  private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;
    constructor(private http: HttpClient) {
      this.userSubject = new BehaviorSubject<User | null>(
        JSON.parse(localStorage.getItem('user')!)
      );
      this.user = this.userSubject.asObservable();
 }

 login(email:string, password:string ) {
 return this.http.post<any>(this.theUrl, {email, password})
 .pipe(
 map(user => localStorage.setItem('user', JSON.stringify(user))),
catchError(this.handleError<User>("login"))
 );
}
 logout() { localStorage.removeItem('user'); }
 getToken(): string | null  {
 return localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).token :null;
 }


 private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
         this.logout();
         console.error(error);
         console.log(`${operation} failed: ${error.message}`);
         return of(result as T);
      };
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authSrv.getToken()
    if (token) {
      const cloned = req.clone({headers: req.headers.set("Authorization", "Bearer " + token)});
      return next.handle(cloned);
    }
    else {
      return next.handle(req);
    }
  }
*/
}
