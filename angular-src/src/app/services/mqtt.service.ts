import { Injectable } from '@angular/core';
import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {AuthService} from './auth.service';

@Injectable()

export class MqttService {

  constructor(
    private http:Http,
    private authService: AuthService
  ) { }

  authToken: any = this.authService.getToken();

  sendBlackout(blackout){
    let headers = new Headers();
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:4000/dashboard/blackout', blackout,{headers:headers})
      .map(res => res.json());
  }

}
