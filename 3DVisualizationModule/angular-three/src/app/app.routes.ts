import { Routes } from '@angular/router';
import { SpecializationComponent } from './component/specialization/specialization.component'
import { DetailsComponent } from './component/details/details.component';
import { CubeComponent } from './cube/cube.component';
import { HospitalComponent } from './hospital/hospital.component';
import { HomePageComponent } from './component/home-page/home-page.component';
import { LoginComponent } from './component/login/login.component';
import { AdminComponent } from './component/admin/admin.component';
import { DoctorComponent } from './component/doctor/doctor.component';
import { UnauthorizedComponent } from './component/unauthorized/unauthorized.component';
import { PatientComponent } from './component/patient/patient.component';
import { AuthGuard } from './guard/auth.guard';

const routeConfig: Routes = [

  { path:'', component: HomePageComponent, title:'Home Page' },

  { path: 'details/:name', component: DetailsComponent, title: 'Details Page' },
  { path: 'cube', component: CubeComponent },
  { path: 'hospital', component: HospitalComponent},
  {path: 'login', component: LoginComponent},

  {path: 'doctor',
    component: DoctorComponent,
    title:'Doctor Page',
    canActivate: [AuthGuard],
    data: {expectedRoles: 1}},

   {path: 'admin',
    component: AdminComponent,
    title:'Admin Page',
    canActivate: [AuthGuard],
    data: {expectedRoles: 0}},

    {path:'patient',
    component: PatientComponent,
    title:'Patient Page',
    canActivate: [AuthGuard],
    data: {expectedRoles: 4}},

    {
      path: 'unauthorized',
      component: UnauthorizedComponent
    },

  {path: 'specialization', component: SpecializationComponent, title:'Specialization Page'}
 // {path: 'Schedule', component: ScheduleComponent, title:'Schedule Page'}

];

export  default routeConfig;
