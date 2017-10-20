import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../../../app/services/validate.service';
import {AuthService} from '../../../../app/services/auth.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';
import {User} from './user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: string;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean = false;
  users : any;
  form_usuario: string = "form-group";
  user: User;

  constructor(
    private validateService: ValidateService,
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.getUsers().subscribe(users => {
      this.users = users.users;
    },
      err => {
      console.log(err);
      return false;
      } );
  }

  usuarioExiste(){
    for(let user of this.users){
      if(user.username==this.username){
        console.log("found")
        //this.form_usuario = "form-group has-error";
      } else {
        //this.form_usuario = "form-group";
      }
    }
  }

  onRegisterSubmit(){

    //Validate Email
    if(!this.validateService.validateEmail(this.user.email)){
      this.flashMessage.show("Por favor, ingrese un correo valido",{cssClass: 'alert-danger', timeout:3000});
      return false;
    }

    //Register user
    this.authService.registerUser(this.user).subscribe(data => {
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
