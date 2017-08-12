import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/admin/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminComponent } from './components/admin/admin.component';

import {AuthService} from './services/auth.service';
import {ValidateService} from '../app/services/validate.service';
import {MqttService} from '../app/services/mqtt.service';
import {FlashMessagesModule} from 'angular2-flash-messages';
import {AuthGuard} from './guards/auth.guard';
import {AuthAdminGuard} from './guards/auth-admin.guard';
import { ErrorComponent } from './components/error/error.component';
import { BlackoutComponent } from './components/dashboard/blackout/blackout.component';

import {YesNoPipe} from './components/admin/admin.pipe';


const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent,canActivate:[AuthAdminGuard]},
  {path:'login', component: LoginComponent},
  {path:'dashboard',component:DashboardComponent,canActivate:[AuthGuard]},
  {path:'profile',component:ProfileComponent,canActivate:[AuthGuard]},
  {path:'admin',component:AdminComponent,canActivate:[AuthAdminGuard]},
  {path:'dashboard/blackout',component:BlackoutComponent, canActivate:[AuthGuard]},
  {path: '**' ,  component: ErrorComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    AdminComponent,
    ErrorComponent,
    BlackoutComponent,
    YesNoPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule
  ],
  providers: [ValidateService,AuthService,AuthGuard,AuthAdminGuard,MqttService],
  bootstrap: [AppComponent]
})
export class AppModule { }
