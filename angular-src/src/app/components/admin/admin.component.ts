import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../app/services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';
import {User} from '../../../app/components/admin/register/user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  users: User[];
  usert: User = new User('', '', '', '', '', false);

  constructor(private authService: AuthService, private router: Router, private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    this.authService.getUsers().then((users: any) => {
      this.users = users.users;
    },
      err => {
      console.log(err);
      return false;
      } );
  }

  temporal(user) {
    this.usert = user;
  }

  deleteUser(id: string) {
    this.authService.deleteUser(id).then((data: any) => {
      if (data.success) {
        this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
        window.location.reload();
      }
    });
  }

}
