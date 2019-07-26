import {Injectable} from '@angular/core';
import {Router,CanActivate} from '@angular/router';
import {AuthService} from '../../app/services/auth.service';

@Injectable()

export class AuthAdminGuard implements CanActivate{
  constructor(private authService: AuthService, private router:Router){}

  canActivate(){
    if(this.authService.loggedIn()&&this.authService.adminAccess()){
      return true;
    } else if(this.authService.loggedIn()&&this.authService.adminAccess()==false){
      this.router.navigate(['/dashboard']);
      return false;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
