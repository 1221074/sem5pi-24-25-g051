import { Routes } from '@angular/router';
import { SpecializationComponent } from './component/specialization/specialization.component'
import { DetailsComponent } from './component/details/details.component';
import { CubeComponent } from './cube/cube.component';

const routeConfig: Routes = [
  
  { path:'', component: SpecializationComponent, title:'Home Page' },
  { path: 'details/:name', component: DetailsComponent, title: 'Details Page' },

  // Redirect to the cube component on app load
  // { path: '', redirectTo: '/cube', pathMatch: 'full' },
  // Route for the cube component
  { path: 'cube', component: CubeComponent },
];

export  default routeConfig;
