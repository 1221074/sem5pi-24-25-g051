import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { CubeComponent } from './component/cube/cube.component';

export const routes: Routes = [
    {path: '', redirectTo: 'cube', pathMatch: 'full'},
    {path: 'cube', component: CubeComponent},



];

