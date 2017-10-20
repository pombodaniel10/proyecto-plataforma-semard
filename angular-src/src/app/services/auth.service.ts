import { Injectable } from '@angular/core';
import {Http,Headers, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {tokenNotExpired} from 'angular2-jwt';
import {User} from  '../.././app/components/admin/register/user';

@Injectable()
export class AuthService {
  authToken: any;
  user: User = JSON.parse(localStorage.getItem('user'));

  constructor(private http:Http) { }

  getUser(): Promise<void | User> {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('users/profile',{headers:headers})
      .toPromise()
      .then(response => response.json() as User)
      .catch(this.handleError);
  }

  registerUser(user){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.post('users/register', user,{headers:headers})
      .map(res => res.json());
  }

  deleteUser(user){
    let headers = new Headers();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.delete('users/deleteuser',{headers:headers,body:user})
      .map(res => res.json());
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('users/authenticate', user,{headers:headers})
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
    return this.http.get('users/admin',{headers:headers})
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
    return this.http.get('users/logout',{headers:headers})
      .map(res => res.json());
  }

  private handleError (error: any) {
      let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
    }

}
