import { Component, OnInit } from '@angular/core';
import { WsService } from '../../../../app/services/ws.service';
import {ILuces} from './luces';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-luces',
  templateUrl: './luces.component.html',
  styleUrls: ['./luces.component.css']
})
export class LucesComponent{

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
  public barChartType:string = 'line';
  public barChartLegend:boolean = true;

  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Bombillo 1 Encedido'},
    {data: [12, 25, 23, 70, 51, 44, 80], label: 'Bombillo 1 Apagado'}
  ];

  public barChartColors: Array<any> = [
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

  public actualizar():void {

    let request = {
      type: "lucesRDATA",
      message: {}
    }

    this.wsService.messages.next(request);

  }

  link: string = "https://www.w3schools.com/js/pic_bulboff.gif";
  estado: string = "Apagado";
  status: boolean = false;
  error: boolean = false;
  success: boolean = false;
  exito: boolean = false;

  constructor(private flashMessage: FlashMessagesService,private wsService: WsService) {
    wsService.messages.subscribe(msg => {
      this.onmessageWS(msg);
    });
  }


  enviarTarea(){
    if (this.status==false) {
      this.focoOn();
    } else {
      this.focoOff();
    }
    let luces:ILuces = {
      type: "luces",
      message: {status:this.status}
    }
    this.wsService.messages.next(luces);
  }

  focoOn(){
    this.status = true;
    this.link = "https://www.w3schools.com/js/pic_bulbon.gif";
    this.estado = "Encedido";
  }

  focoOff(){
    this.status = false;
    this.link = "https://www.w3schools.com/js/pic_bulboff.gif";
    this.estado = "Apagado";
  }

  onmessageWS(msg){
    if(msg.type=="lucesOut"){
      console.log("out");
      this.error = false;
      this.exito = true;
      this.success = true;
      if(msg.message.status==true){
        this.focoOn();
      }else if(msg.message.status==false){
        this.focoOff();
      }
      setTimeout(() => {
        this.success = false;
      }, 8000);
    }else if(msg.type=="lucesESTADO"){
      if(msg.message.status==true){
        this.focoOn();
      }else if(msg.message.status==false){
        this.focoOff();
      }
    }else if(msg.type=="errorLuces"&&this.exito==false){
      this.error = true;
      this.exito = false;
      if (this.status==false) {
          this.focoOn();
      } else {
          this.focoOff();
      }
      setTimeout(() => {
        this.error = false;
      }, 8000);
    } else if(msg.type=="lucesDATA"){

      let data = [
        msg.message.on.lunes,
        msg.message.on.martes,
        msg.message.on.miercoles,
        msg.message.on.jueves,
        msg.message.on.viernes,
        msg.message.on.sabado,
        msg.message.on.domingo];

        let dataoff = [
          msg.message.off.lunes,
          msg.message.off.martes,
          msg.message.off.miercoles,
          msg.message.off.jueves,
          msg.message.off.viernes,
          msg.message.off.sabado,
          msg.message.off.domingo];

      let clone = JSON.parse(JSON.stringify(this.barChartData));
      clone[0].data = data;
      clone[1].data = dataoff;
      this.barChartData = clone;
    }
  }

}
