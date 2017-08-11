import { Component, OnInit } from '@angular/core';
import {MqttService} from '../../../../app/services/mqtt.service';

@Component({
  selector: 'app-blackout',
  templateUrl: './blackout.component.html',
  styleUrls: ['./blackout.component.css']
})
export class BlackoutComponent implements OnInit {

  vueltas: number;
  sentido: String;

  constructor(
    private mqttService: MqttService,
  ) { }

  ngOnInit() {
  }

  onBlackoutSubmit(){
    const blackout = {
      vueltas: this.vueltas,
      sentido: this.sentido
    }

    this.mqttService.sendBlackout(blackout).subscribe(data => {
      if(data.sucess){

      }else {
        
      }
    });
  }
}
