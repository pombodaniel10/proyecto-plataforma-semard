import { Component, OnInit} from '@angular/core';
import { WsService } from '../../../../app/services/ws.service';
import {IBlackout} from './blackout';

@Component({
  selector: 'app-blackout',
  templateUrl: './blackout.component.html',
  styleUrls: ['./blackout.component.css']
})
export class BlackoutComponent implements OnInit {

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
  public barChartLabelsWeek:string[] = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
  public barChartType:string = 'line';
  public barChartLegend:boolean = true;

  public barChartData:any[] = [
    {data: [0,0,0,0,0,0,0], label: 'Movimientos de la persina'}
  ];

  public barChartDataWeek:any[] = [
    {data: [0,0,0,0], label: 'Movimientos de la persina'}
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

    //this.barChartType = this.barChartType === 'bar' ? 'line' : 'bar';

    let xd = {
      type: "blackoutRDATA",
      message: {}
    }

    this.wsService.messages.next(xd);


  }


  sentidoGiro: string;
  messages: any = {};
  progress: number = 0;
  vslider: number = 0;
  vtemporal: number = 0;
  error: boolean = false;
  success: boolean = false;
  estadoPersiana: string = "Persiana arriba"
  estadoMovimiento: boolean = false;
  link: string = "../../../../assets/images/persiana0.png"


  constructor(
    private wsService: WsService
  ) {
    wsService.messages.subscribe(msg => {
      if(msg.type=="blackoutOut"){
        if(msg.message.estado=="Esperando orden"){
          this.vslider = msg.message.vueltas;
          this.onValueChange();
        }else if(msg.message.estado=="girando"){
          this.vtemporal = this.vslider;
          this.estadoMovimiento = true;
          this.error = false;
          this.messages = msg.message;
          this.progress = msg.message.progreso;
        }else if(msg.message.estado=="finalizado"){
          this.estadoMovimiento = false;
          this.messages = {};
          this.progress = 0;
          this.success = true;
          setTimeout(() => {
            this.success = false;
          }, 5000);
        }
      }else if(msg.type=="errorBlackout"&&this.messages.estado==null){
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
		});
  }

  ngOnInit() {
    let xd = {
      type: "blackoutRDATA",
      message: {}
    }

    this.wsService.messages.next(xd);
  }

    onValueChange(){
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
    this.estadoMovimiento = true;
    let blackout:IBlackout = {
      type: "blackout",
      message: {vueltas:this.vslider,sentido:this.sentidoGiro}
    }
    this.wsService.messages.next(blackout);
  }

}
