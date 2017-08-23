import { Component, OnInit} from '@angular/core';
import {MqttSErvice} from '../../../../app/services/mqtt.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import { ChatService } from '../../../../app/services/chat.service';
import {IBlackout} from './blackout';

@Component({
  selector: 'app-blackout',
  templateUrl: './blackout.component.html',
  styleUrls: ['./blackout.component.css']
})
export class BlackoutComponent implements OnInit {

  vueltas: number;
  sentidoGiro: string;
  messages: any = {};
  progress: number = 0;

  connection;

  constructor(
    private mqttService: MqttSErvice,
    private flashMessage: FlashMessagesService,
    private chatService: ChatService
  ) {
    chatService.messages.subscribe(msg => {
      if(msg.type=="blackout"){
        this.messages = msg;
        this.progress = msg.message.progreso;
      }
		});
  }


  ngOnInit() {
  }

  onBlackoutSubmit(){
    let blackout: IBlackout = {
      type: "blackout",
      message: {vueltas:this.vueltas,sentido:this.sentidoGiro}
    }

    let blackout2 = {
      vueltas: this.vueltas,
      sentido: this.sentidoGiro
    }

    this.mqttService.sendBlackout(blackout2).subscribe(data => {
      if(data.success){
          this.flashMessage.show(data.msg,{cssClass:'alert-success', timeout:3000});
      }else {
          this.flashMessage.show(data.msg,{cssClass: 'alert-danger', timeout:3000});
      }
    });
  }
}
