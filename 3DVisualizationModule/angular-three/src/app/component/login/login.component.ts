import { AfterViewInit, Component, ElementRef, NgModule, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

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

    this.http.get(apiUrl).subscribe(
      (res: any) => {
        const role = res.role;
        // Redirect based on role
        switch (role) {
          case 'ADMIN':
            this.router.navigate(['/admin']);
            break;
          case 'DOCTOR':
            this.router.navigate(['/doctor']);
            break;
          case 'PATIENT':
            this.router.navigate(['/patient']);
            break;
          default:
            console.error('Unknown role:', role);
        }
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


