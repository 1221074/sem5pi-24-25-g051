import { Routes } from '@angular/router';
import { SpecializationComponent } from './component/specialization/specialization.component'
import { DetailsComponent } from './component/details/details.component';
import { CubeComponent } from './cube/cube.component';
import { HomePageComponent } from './component/home-page/home-page.component';
import { LoginComponent } from './component/login/login.component';
import { AdminComponent } from './component/admin/admin.component';
import { DoctorComponent } from './component/doctor/doctor.component';

const routeConfig: Routes = [

  { path:'', component: HomePageComponent, title:'Home Page' },

  { path: 'details/:name', component: DetailsComponent, title: 'Details Page' },
  // Redirect to the cube component on app load
  // Route for the cube component
  { path: 'cube', component: CubeComponent },
  {path: 'login', component: LoginComponent},
  //{ path: 'privacy-policy', component: PrivacyPolicyComponent } // Certifique-se de que este componente existe
  {path: 'admin', component: AdminComponent, title:'Admin Page'},
  {path: 'doctor', component: DoctorComponent, title:'Doctor Page'},
];

export  default routeConfig;
