import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CubeComponent } from './component/cube/cube.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './component/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent,CubeComponent, RouterModule],
  template: `
  <main>
     <header class="brand-name">
       <h1>Hello world!</h1>
      </header>
      <section class="content">
        <app-login></app-login>
      </section>
    </main>
  `,
  styleUrls: ['./app.component.scss'],

})
export class AppComponent {

  showCube = true;
  showLogin = true;

  toogleCube() {this.showCube = !this.showCube;}
  toogleLogin() {this.showLogin = !this.showLogin;}

}
