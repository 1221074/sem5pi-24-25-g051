import path from "path";
import { CubeComponent } from "./cube/cube.component";
import { Routes } from "@angular/router";

export const routes: Routes = [
    {path: '', redirectTo: 'cube', pathMatch: 'full'},
    {path: 'cube', component: CubeComponent},

];
