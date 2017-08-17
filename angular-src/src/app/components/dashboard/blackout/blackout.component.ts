import { Component, OnInit,OnDestroy  } from '@angular/core';
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
  estado: string;
  sentidoGiro: string;
  messages: IBlackout[];

  connection;

  constructor(
    private mqttService: MqttSErvice,
    private flashMessage: FlashMessagesService,
    private chatService: ChatService
  ) {
  }


  ngOnInit() {
    this.connection = this.chatService.getMessages().subscribe(message => {
      console.log(message);
      this.estado = message.toString();
    });
  }

  onBlackoutSubmit(){
    const blackout = {
      vueltas: this.vueltas,
      sentido: this.sentidoGiro
    }

    this.chatService.sendMessage(blackout);

    this.mqttService.sendBlackout(blackout).subscribe(data => {
      if(data.success){
          this.flashMessage.show(data.msg,{cssClass:'alert-success', timeout:3000});
      }else {
          this.flashMessage.show(data.msg,{cssClass: 'alert-danger', timeout:3000});
      }
    });
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
