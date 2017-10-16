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
        this.link = "https://www.w3schools.com/js/pic_bulbon.gif";
        this.estado = "encedido";
      }else {
        this.link = "https://www.w3schools.com/js/pic_bulboff.gif";
        this.estado = "apagado";
      }
    }else if(msg.type=="error"){
      this.flashMessage.show("Error al comunicarse con el dispostivo", {
      cssClass: 'alert-warning',
      timeout:5000});
    }
    });}

  ngOnInit() {
  }

  changeImage(){
    if (this.link=="https://www.w3schools.com/js/pic_bulboff.gif") {
        this.link = "https://www.w3schools.com/js/pic_bulbon.gif";
        this.estado = "encedido";
        this.status = true;
    } else {
        this.link = "https://www.w3schools.com/js/pic_bulboff.gif";
        this.estado = "apagado";
        this.status = false;
    }
    let luces:ILuces = {
      type: "luces",
      message: {status:this.status}
    }
    this.wsService.messages.next(luces);
  }

}
