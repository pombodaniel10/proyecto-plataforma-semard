import { Component, OnInit } from '@angular/core';
import {MqttService} from '../../../../app/services/mqtt.service';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-blackout',
  templateUrl: './blackout.component.html',
  styleUrls: ['./blackout.component.css']
})
export class BlackoutComponent implements OnInit {

  vueltas: number;
  sentido: String;
  estado: String = "hola";

  constructor(
    private mqttService: MqttService,
    private flashMessage: FlashMessagesService
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
          this.flashMessage.show(data.msg,{cssClass: 'alert-success', timeout:3000});
      }else {
          this.flashMessage.show(data.msg,{cssClass: 'alert-danger', timeout:3000});
      }
    });
  }
}
