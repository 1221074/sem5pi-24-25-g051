import { AfterViewInit, Component, ElementRef, inject, NgModule, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from '../../service/authentication.service';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule,HttpClientModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginBox') private canvasRef!: ElementRef;

  //VARIABLES
  authService: AuthenticationService = inject(AuthenticationService);
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}
  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '57464158480-1vvfvpssor8gqqpmb4rn8m3elh0jspof.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response),
      auto_select: false,
    });

    google.accounts.id.renderButton(
      document.getElementById('g_id_onload'),
      { theme: 'outline', size: 'large' }
    );
  }

  handleCredentialResponse(response: any) {
    console.log('Encoded JWT ID token: ' + response.credential);

    const apiUrl = environment.apiURL + `/user/role?token=${response.credential}`;
    const token = response.credential;
    const decodedToken: any = jwtDecode(token);
    const email = decodedToken.email;

    //put the token in localStorage
    localStorage.setItem('token', token);

    this.http.get(apiUrl).subscribe(
      (res: any) => {
        const role = res.role;
        // Redirect based on role
        switch (role) {
          case 0:
            localStorage.setItem('role', role.toString());
            this.router.navigate(['/admin']);
            break;
          case 1:
            localStorage.setItem('role', role.toString());
            this.router.navigate(['/doctor']);
            break;
          case 4:
            localStorage.setItem('role', role.toString());
            this.router.navigate(['/patient']);
            break;
          default:
            console.error('Unknown role:', role);
            this.router.navigate(['/unauthorized']);
        }
        // After successful login
        this.authService.updateUserInformation(email);
        // Revoke the token
        google.accounts.id.revoke(email, (done: any) => {
          console.log('User has been logged out of Google.');
        });
      },
      (error: any) => {
        console.error('Login failed', error);
      }
    );
  }

  onSubmit() {
    // Lógica para lidar com o login usando username e password
    console.log('Username:', this.username);
    console.log('Password:', this.password);
  }


}


