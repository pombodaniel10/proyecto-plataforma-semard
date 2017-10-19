import { Injectable } from '@angular/core';
import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';

@Injectable()
export class AuthService {
  authToken: any;
  user: any = JSON.parse(localStorage.getItem('user'));

  constructor(private http:Http) { }

  registerUser(user){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/users/register', user,{headers:headers})
      .map(res => res.json());
  }

  deleteUser(user){
    let headers = new Headers();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.delete('http://localhost:8080/users/deleteuser',{headers:headers,body:user})
      .map(res => res.json());
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/users/authenticate', user,{headers:headers})
      .map(res => res.json());
  }

  getProfile(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:8080/users/profile',{headers:headers})
      .map(res => res.json());
  }

  storeUserData(token,user){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user',JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getUsers(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:8080/users/admin',{headers:headers})
      .map(res => res.json());
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  getToken(){
    return this.authToken;
  }

  loggedIn() {
    return tokenNotExpired('id_token');
  }

  adminAccess(){
    if(this.user){
      return this.user.isAdmin;
    } else {
      return false;
    }
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:8080/users/logout',{headers:headers})
      .map(res => res.json());
  }
}
