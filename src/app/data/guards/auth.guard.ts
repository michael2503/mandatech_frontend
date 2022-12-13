import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private authS: AuthService, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise((resolve) => {
      this.authS.checking.subscribe((checking) => {
        if (!checking) {
          this.authS.user.subscribe((auth) => {
            resolve(!!auth || this.router.parseUrl('/login'));
            if (!auth && this.router.url.match(/\/user(\/.+)?$/)) {
              this.router.navigateByUrl('/login');
            }
          });
        }
      });
    });
  }
}
