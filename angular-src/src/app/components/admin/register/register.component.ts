import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../../../app/services/validate.service';
import {AuthService} from '../../../../app/services/auth.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: String;
  username: String;
  email: String;
  password: String;
  isAdmin: boolean = false;

  constructor(
    private validateService: ValidateService,
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onRegisterSubmit(){
    const user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
      isAdmin: this.isAdmin
    }

    //Required fields
    if(!this.validateService.validateRegister(user)){
      this.flashMessage.show("Por favor, llene todo los campos",{cssClass: 'alert-danger', timeout:3000});
      return false;
    }

    //Validate Email
    if(!this.validateService.validateEmail(user.email)){
      this.flashMessage.show("Por favor, ingrese un correo valido",{cssClass: 'alert-danger', timeout:3000});
      return false;
    }

    //Register user
    this.authService.registerUser(user).subscribe(data => {
      if(data.success){
        this.flashMessage.show("¡Registro exitoso!",{cssClass: 'alert-success', timeout:3000});
        this.router.navigate(['admin']);
      }else{
        this.flashMessage.show(data.msg,{cssClass: 'alert-danger', timeout:3000});
        this.router.navigate(['register']);
      }
    });

  }

}
