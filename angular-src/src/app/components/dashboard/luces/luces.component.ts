import { Component, OnInit } from '@angular/core';
import { WsService } from '../../../../app/services/ws.service';
import {ILuces} from './luces';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-luces',
  templateUrl: './luces.component.html',
  styleUrls: ['./luces.component.css']
})
export class LucesComponent implements OnInit {

  link: string = "https://www.w3schools.com/js/pic_bulboff.gif";
  estado: string = "apagado";
  status: boolean = false;

  constructor(private flashMessage: FlashMessagesService,private wsService: WsService) {
    wsService.messages.subscribe(msg => {
    if(msg.type=="luces"){
      if(msg.message.status==true){
        this.focoOn();
      }else {
        this.focoOff();
      }
    }else if(msg.type=="error"){
      this.flashMessage.show("Error al comunicarse con el dispostivo", {
      cssClass: 'alert-warning',
      timeout:5000});
    }
    });}

    ngOnInit(){

    }

    changeImage(){
      if (this.status==false) {
          this.focoOn();
      } else {
          this.focoOff();
      }
      this.status = !this.status;
      let luces:ILuces = {
        type: "luces",
        message: {status:this.status}
      }
      this.wsService.messages.next(luces);
    }

    focoOn(){
      this.link = "https://www.w3schools.com/js/pic_bulbon.gif";
      this.estado = "Encedido";
    }
    focoOff(){
      this.link = "https://www.w3schools.com/js/pic_bulboff.gif";
      this.estado = "Apagado";
    }

}
