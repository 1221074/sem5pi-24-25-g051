import { AfterViewInit, Component, ElementRef, NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('loginBox') private canvasRef!: ElementRef;

  username: string = '';
  password: string = '';

  constructor() { }


  ngAfterViewInit(): void {
    console.log('A visualização foi inicializada');
   }

   onSubmit() {
    // Lógica para lidar com o login usando username e password
    console.log('Username:', this.username);
    console.log('Password:', this.password);
  }


   loginWithGoogle() {
      console.log('Login com Google');
    }

    logout() {
      console.log('Login com Facebook');
    }
}


