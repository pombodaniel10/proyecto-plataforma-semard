import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../app/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  users:Object;


  constructor(private authService: AuthService, private router:Router) { }

  ngOnInit() {
    this.authService.getUsers().subscribe(users => {
      this.users = users.users;
    },
      err => {
      console.log(err);
      return false;
      } );
  }

}
