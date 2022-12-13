import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {

  constructor(private authS: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve) => {
      this.authS.user.subscribe(auth => {
        if (auth) {
          if (!+auth.email_verify) {
            resolve(this.router.parseUrl('/user/verify-email'));
          } else if (!auth?.first_name) {
            resolve(this.router.parseUrl('/user/personal-info'));
          } else if (!+auth?.bank_verify) {
            resolve(this.router.parseUrl('/user/payment-info'));
          } else if (!+auth?.activation) {
            resolve(this.router.parseUrl('/user/activate'));
          } else if (!auth?.first_member) {
            resolve(this.router.parseUrl('/user/placement-settings'));
          } else {
            resolve(true);
          }
        } else {
          resolve(this.router.parseUrl('/login'));
        }
      })
    });
  }

}
