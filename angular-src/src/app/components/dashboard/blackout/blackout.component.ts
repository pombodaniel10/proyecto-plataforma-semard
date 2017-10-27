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
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;

  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Movimientos de la persina'}
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
        this.vtemporal = this.vslider;
        this.estadoMovimiento = true;
        this.error = false;
        this.messages = msg.message;
        this.progress = msg.message.progreso;
        if(msg.message.estado=="finalizado"){
          this.estadoMovimiento = false;
          this.messages = {};
          this.progress = 0;
          this.error = true;
          setTimeout(() => {
            this.success = false;
          }, 5000);
        }
      }else if(msg.type=="error"&&this.messages.estado==null){
        this.error = true;
        this.vslider = this.vtemporal;
        this.onValueChange();
        this.estadoMovimiento = false;
        setTimeout(() => {
          this.error = false;
        }, 10000);
      }
		});
  }

  ngOnInit() {
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
