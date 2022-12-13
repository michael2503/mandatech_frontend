import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlacementGuard implements CanActivate {

  constructor(
    private authS: AuthService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve)=> {
      this.authS.user.subscribe(auth => {
        if (auth) {
          if (auth.first_member) {
            resolve(this.router.parseUrl('/user/dashboard'));
          } else {
            resolve(true);
          }
        } else {
          resolve(this.router.parseUrl('/login'));
          this.router.navigateByUrl('/login');
        }
      })
    });
  }

}
