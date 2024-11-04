import { AfterViewInit, Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
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


