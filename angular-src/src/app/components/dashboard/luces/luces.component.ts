import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-luces',
  templateUrl: './luces.component.html',
  styleUrls: ['./luces.component.css']
})
export class LucesComponent implements OnInit {

  link: string = "https://www.w3schools.com/js/pic_bulboff.gif";
  estado: string = "apagado";
  constructor() { }

  ngOnInit() {
  }

  changeImage(){
    if (this.link=="https://www.w3schools.com/js/pic_bulboff.gif") {
        this.link = "https://www.w3schools.com/js/pic_bulbon.gif";
        this.estado = "encedido";
    } else {
        this.link = "https://www.w3schools.com/js/pic_bulboff.gif";
        this.estado = "apagado";
    }
  }

}
