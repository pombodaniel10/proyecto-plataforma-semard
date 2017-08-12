import { Injectable } from '@angular/core';
import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()

export class MqttService {

  constructor(
    private http:Http,
  ) { }
  
  sendBlackout(blackout){
    let headers = new Headers();
    headers.append('Authorization',localStorage.getItem('id_token'));
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:4000/dashboard/blackout', blackout,{headers:headers})
      .map(res => res.json());
  }

}
