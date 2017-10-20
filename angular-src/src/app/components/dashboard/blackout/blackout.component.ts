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
  error: boolean = false;
  link: string = "https://www.tenvinilo.com/vinilos-decorativos/img/preview/vinilo-decorativo-ventana-comic-cerrada-4631.png"

  constructor(
    private flashMessage: FlashMessagesService,
    private wsService: WsService
  ) {
    wsService.messages.subscribe(msg => {
      if(msg.type=="blackoutOut"){
        this.error = false;
        this.messages = msg;
        this.progress = msg.message.progreso;
        if(msg.message.estado=="finalizado"){
          this.messages = {};
          this.progress = 0;
        }
      }else if(msg.type=="error"){
        this.error = true;
      }
		});
  }


  ngOnInit() {
  }

  subirPersiana(){

    this.link = "https://www.tenvinilo.com/vinilos-decorativos/img/preview/vinilo-decorativo-ventana-comic-abierta-4630.png";

    let blackout:IBlackout = {
      type: "blackout",
      message: {vueltas:12,sentido:"clockwise"}
    }
    this.wsService.messages.next(blackout);
  }

  bajarPersiana(){

    this.link = "https://www.tenvinilo.com/vinilos-decorativos/img/preview/vinilo-decorativo-ventana-comic-cerrada-4631.png";

    let blackout:IBlackout = {
      type: "blackout",
      message: {vueltas:12,sentido:"counterclockwise"}
    }
    this.wsService.messages.next(blackout);
  }

  onBlackoutSubmit(){
    let blackout:IBlackout = {
      type: "blackout",
      message: {vueltas:this.vueltas,sentido:this.sentidoGiro}
    }
    this.wsService.messages.next(blackout);
  }

  refresh(): void {
    window.location.reload();
}
}
