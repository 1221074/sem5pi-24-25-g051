import { AfterViewInit, Component, ElementRef, inject, NgModule, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from '../../service/authentication.service';
import { jwtDecode } from 'jwt-decode';

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule,HttpClientModule],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('loginBox') private canvasRef!: ElementRef;

  //VARIABLES
  authService: AuthenticationService = inject(AuthenticationService);
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Initialize Google Sign-In
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

    const apiUrl = `https://localhost:7252/api/user/role?token=${response.credential}`;
    const token = response.credential;
    const decodedToken: any = jwtDecode(token);
    const email = decodedToken.email

    this.http.get(apiUrl).subscribe(
      (res: any) => {
        const role = res.role;
        // Redirect based on role
        switch (role) {
          case 0:
            this.router.navigate(['/admin']);
            break;
          case 1:
            this.router.navigate(['/doctor']);
            break;
          case 2:
            this.router.navigate(['/patient']);
            break;
          default:
            console.error('Unknown role:', role);
        }
        console.log('Email:', email);
        // After successful login
        this.authService.updateMail(email);
      },
      (error) => {
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


