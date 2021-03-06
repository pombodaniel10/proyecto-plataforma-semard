import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../app/services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent{
  loop: any;
  constructor(
    public authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }


  onLogoutClick(){
    this.authService.logout();
    this.flashMessage.show("Sesión cerrada.", {
      cssClass: 'alert-success',
      timeout: 3000
    });
    this.router.navigate(['login']);
    return false;
  }

  isHome(){
    return this.router.isActive("/",true);
  }
}
