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
  link: string =  "http://localhost:8080/"
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

  registerUser(newUser: User){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.post('users/register', newUser,{headers:headers})
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  deleteUser(deleteUser:User){
    let headers = new Headers();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.delete('users/deleteuser',{headers:headers,body:deleteUser})
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('users/authenticate', user,{headers:headers})
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  storeUserData(token,user){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user',JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getUsers(): Promise<void | User[]>{
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('users/admin',{headers:headers})
    .toPromise()
    .then(response => response.json() as User[])
    .catch(this.handleError);
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
