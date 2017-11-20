import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse, HttpParams} from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import {tokenNotExpired} from 'angular2-jwt';
import {User} from '../.././app/components/admin/register/user';

@Injectable()
export class AuthService {
  authToken: any;
  user: User = JSON.parse(localStorage.getItem('user'));
  link: string = '/users/';
  constructor(private http: HttpClient) { }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  getToken(){
    return this.authToken;
  }

  getUser(): Promise<void | User> {
    this.loadToken();
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', this.authToken);
    return this.http.get(this.link + 'profile', {headers: headers})
      .toPromise()
      .then(HttpResponse => HttpResponse as User)
      .catch(this.handleError);
  }

  registerUser(newUser: User) {
    this.loadToken();
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', this.authToken);
    return this.http.post(this.link + 'register', newUser, {headers: headers})
      .toPromise()
      .then(HttpResponse => HttpResponse)
      .catch(this.handleError);
  }

  deleteUser(id: string) {
    this.loadToken();
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', this.authToken);
    return this.http.delete(this.link + 'deleteuser' + '/' + id, {headers: headers})
      .toPromise()
      .then(HttpResponse => HttpResponse)
      .catch(this.handleError);
  }

  authenticateUser(user) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this.http.post(this.link + 'authenticate', user, {headers: headers})
      .toPromise()
      .then(HttpResponse => HttpResponse)
      .catch(this.handleError);
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getUsers(): Promise<void | User[]>{
    this.loadToken();
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', this.authToken);
    return this.http.get(this.link + 'admin', {headers: headers})
    .toPromise()
    .then(HttpResponse => HttpResponse as User[])
    .catch(this.handleError);
  }

  loggedIn() {
    return tokenNotExpired('id_token');
  }

  adminAccess(){
    if (this.user){
      return this.user.isAdmin;
    } else {
      return false;
    }
  }

  logout() {
    this.loadToken();
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', this.authToken);

    this.authToken = null;
    this.user = null;
    localStorage.clear();

    return this.http.get(this.link + 'logout', {headers: headers})
      .toPromise()
      .then(HttpResponse => HttpResponse)
      .catch(this.handleError);

  }

  private handleError (error: any) {
      const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
    }

}
