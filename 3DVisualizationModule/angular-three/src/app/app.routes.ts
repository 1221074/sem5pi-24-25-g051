import { Routes } from '@angular/router';
import { SpecializationComponent } from './component/specialization/specialization.component'
import { DetailsComponent } from './component/details/details.component';

const routeConfig: Routes = [
  {path:'', component: SpecializationComponent,
  title:'Home Page'},
   {
    path: 'details/:name',
    component: DetailsComponent,
    title: 'Details Page'
   }
];

export  default routeConfig;
