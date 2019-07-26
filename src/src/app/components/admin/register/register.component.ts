import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {ValidateService} from '../../../../app/services/validate.service';
import {AuthService} from '../../../../app/services/auth.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';
import {User} from './user';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  users: User[];
  user: User = new User('', '', '', '', '', false);
  form: FormGroup;

  constructor(
    private validateService: ValidateService,
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = new FormGroup({
      'name': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'username': new FormControl('', [Validators.required, Validators.minLength(5)]),
      'email': new FormControl('', Validators.required),
      'password': new FormControl('', [Validators.required, Validators.minLength(8)]),
      'password2': new FormControl(),
      'isAdmin': new FormControl(false)
    });

    this.form.controls['password2'].setValidators(
    [  Validators.required,
      this.noIguales.bind(this.form)]
    );

   }

  noIguales(control: FormControl): {[s: string]: boolean} {
    const forma: any = this;
    if (control.value !== forma.controls['password'].value) {
      return {
        noIguales: true
      };
    }
    return null;
  }

  onRegisterSubmit() {

    this.user = this.form.value;

    // Validate Email
    if (!this.validateService.validateEmail(this.user.email)) {
      this.flashMessage.show('Por favor, ingrese un correo valido', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // Register user
    this.authService.registerUser(this.user)
      .then((data: any) => {
      if (data.success) {
        this.flashMessage.show('¡Registro exitoso!', {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['admin']);
      } else {
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['register']);
      }
    });

  }

}
