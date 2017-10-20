import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../app/services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  users:Object;
  usert: Object = {name: String, username:String, email:String, password:String, isAdmin: Boolean};

  constructor(private authService: AuthService, private router:Router,private flashMessage: FlashMessagesService,) { }

  ngOnInit() {
    this.authService.getUsers().subscribe(users => {
      this.users = users.users;
    },
      err => {
      console.log(err);
      return false;
      } );
  }

  temporal(user){
    this.usert = user;
  }

  deleteUser(user){
    this.authService.deleteUser(user).subscribe(data => {
      if(data.success){
        this.flashMessage.show(data.msg,{cssClass: 'alert-success', timeout:3000});
        this.router.navigate(['admin']);
      }
    });
  }

  editUser(user){

  }
}
