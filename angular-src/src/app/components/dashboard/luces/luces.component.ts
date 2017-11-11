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
  public barChartType:string = 'bar';
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

  public randomize():void {
    // Only Change 3 values
    let data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
    /**
     * (My guess), for Angular to recognize the change in the dataset
     * it has to change the dataset variable directly,
     * so one way around it, is to clone the data, change it and then
     * assign it;
     */
  }

  link: string = "https://www.w3schools.com/js/pic_bulboff.gif";
  estado: string = "Apagado";
  status: boolean = false;
  error: boolean = false;
  success: boolean = false;
  exito: boolean = false;

  constructor(private flashMessage: FlashMessagesService,private wsService: WsService) {
    wsService.messages.subscribe(msg => {
    if(msg.type=="lucesOut"){
      this.error = false;
      if(msg.message.status==true){
        this.focoOn();
      }else if(msg.message.status==false){
        this.focoOff();
      }
      this.exito = true;
      this.success = true;
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
    }
    });}

    changeImage(){
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

}
