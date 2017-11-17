import { Component, OnInit} from '@angular/core';
import { WsService } from '../../../../app/services/ws.service';
import {IBlackout} from './blackout';

@Component({
  selector: 'app-blackout',
  templateUrl: './blackout.component.html',
  styleUrls: ['./blackout.component.css']
})
export class BlackoutComponent{

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
  public barChartLabelsWeek:string[] = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
  public barChartType:string = 'line';
  public barChartLegend:boolean = true;

  public barChartData:any[] = [
    {data: [0,0,0,0,0,0,0], label: 'Movimientos de la persiana'}
  ];

  public barChartDataWeek:any[] = [
    {data: [0,0,0,0], label: 'Movimientos de la persiana'}
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
      type: "blackoutRDATA",
      message: {}
    }

    this.wsService.messages.next(request);


  }


  sentidoGiro: string;
  messages: any = {};
  sliderA: boolean = false;
  progress: number = 0;
  vslider: number = 0;
  vtemporal: number = 0;
  error: boolean = false;
  success: boolean = false;
  estadoPersiana: string = "Persiana arriba"
  estadoMovimiento: boolean = false;
  estadoMovimientoBTN: boolean = true;
  link: string = "../../../../assets/images/persiana0.png"


  constructor(
    private wsService: WsService
  ) {
    wsService.messages.subscribe(msg => {
      this.onMessageWS(msg);
		});
  }

  onMessageWS(msg){
    if(msg.type=="blackoutOut"){
      if(msg.message.estado=="Esperando orden"&&this.sliderA==false){
        if(this.vtemporal!=msg.message.vueltas){
          this.vtemporal = msg.message.vueltas;
          this.vslider = msg.message.vueltas;
          this.onValueChange();
        }
      }else if(msg.message.estado=="girando"){
        this.vtemporal = this.vslider;
        this.estadoMovimiento = true;
        this.estadoMovimientoBTN = true;
        this.error = false;
        this.messages = msg.message;
        this.progress = msg.message.progreso;
      }else if(msg.message.estado=="finalizado"){
        this.estadoMovimiento = false;
        this.estadoMovimientoBTN = false;
        this.messages = {};
        this.progress = 0;
        this.success = true;
        this.onValueChange();
        setTimeout(() => {
          this.success = false;
        }, 5000);
      }
    }else if(msg.type=="errorBlackout"&&this.messages.estado==null&&this.success==false){
      this.error = true;
      this.vslider = this.vtemporal;
      this.onValueChange();
      this.estadoMovimiento = false;
      setTimeout(() => {
        this.error = false;
      }, 8000);
    } else if(msg.type=="blackoutDATA"){

      let data = [
        msg.message.lunes,
        msg.message.martes,
        msg.message.miercoles,
        msg.message.jueves,
        msg.message.viernes,
        msg.message.sabado,
        msg.message.domingo];

      let clone = JSON.parse(JSON.stringify(this.barChartData));
      clone[0].data = data;
      this.barChartData = clone;
    }
  }

  ocurrioUnEvento(event: MouseEvent): void {
       if(event.type=="mouseenter"){
         this.sliderA = true;
       }else if(event.type=="mouseleave"){
         this.sliderA = false;
       }
    }

    onValueChange(){
      if(this.vslider==this.vtemporal){
        this.estadoMovimientoBTN = true;
      } else {
        this.estadoMovimientoBTN = false;
      }
    switch(this.vslider){
      case 0:
      {
        this.estadoPersiana = "Persiana arriba";
        this.link = "../../../../assets/images/persiana0.png";
        break;
      }
      case 5:
      {
        this.estadoPersiana = "Persiana abajo 25%";
        this.link = "../../../../assets/images/persiana1.png";
        break;
      }
      case 10:
      {
        this.estadoPersiana = "Persiana abajo 50%";
        this.link = "../../../../assets/images/persiana2.png";
        break;
      }
      case 15:
      {
        this.estadoPersiana = "Persiana abajo 75%";
        this.link = "../../../../assets/images/persiana3.png";
        break;
      }
      case 20:
      {
        this.estadoPersiana = "Persiana abajo";
        this.link = "../../../../assets/images/persiana4.png";
        break;
      }
    }

  }

  enviarTarea(){

    if(this.vslider>this.vtemporal){
      this.sentidoGiro = "clockwise";
    }else{
      this.sentidoGiro = "counterclockwise";
    }
    let vueltas = 0;
    if(Math.abs(this.vslider-this.vtemporal)==0){
      vueltas = this.vtemporal;
    }else {
      vueltas = Math.abs(this.vslider-this.vtemporal);
    }
    this.estadoMovimiento = true;
    this.estadoMovimientoBTN = true;
    let blackout:IBlackout = {
      type: "blackout",
      message: {vueltas:vueltas,sentido:this.sentidoGiro}
    }
    this.wsService.messages.next(blackout);
  }

}
