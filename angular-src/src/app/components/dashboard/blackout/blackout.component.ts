import { Component, OnInit} from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import { WsService } from '../../../../app/services/ws.service';
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

  constructor(
    private flashMessage: FlashMessagesService,
    private wsService: WsService
  ) {
    wsService.messages.subscribe(msg => {
      if(msg.type=="blackout"){
        this.messages = msg;
        this.progress = msg.message.progreso;
        if(msg.message.estado=="finalizado"){
          this.messages = {};
          this.progress = 0;
        }
      }else if(msg.type=="error"){
        this.flashMessage.show("Error al comunicarse con el dispostivo", {
          cssClass: 'alert-warning',
          timeout:5000});
      }
		});
  }


  ngOnInit() {
  }

  onBlackoutSubmit(){
    let blackout:IBlackout = {
      type: "blackout",
      message: {vueltas:this.vueltas,sentido:this.sentidoGiro}
    }
    this.wsService.messages.next(blackout);
  }
}
