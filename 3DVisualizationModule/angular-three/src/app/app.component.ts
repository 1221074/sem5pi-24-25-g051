import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CubeComponent } from './component/cube/cube.component';
import { LoginComponent } from './component/login/login.component';
import { SpecializationComponent } from './component/specialization/specialization.component';
import { HomePageComponent } from './component/home-page/home-page.component';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './component/admin/admin.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule,CommonModule, CommonModule, HttpClientModule],
  template: `

     <header class="brand-name">
       <h1>Surgical Appointment and Resource Management</h1>
      </header>
      <section class="content">
        <router-outlet></router-outlet>
      </section>

  `,
  styleUrls: ['./app.component.scss'],

})
export class AppComponent {

  showCube = true;
  showLogin = true;

  toogleCube() {this.showCube = !this.showCube;}
  toogleLogin() {this.showLogin = !this.showLogin;}

}
