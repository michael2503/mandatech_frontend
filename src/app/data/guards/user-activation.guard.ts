import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class UserActivationGuard implements CanActivate {
    constructor(private authS: AuthService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return new Promise((resolve) => {
            this.authS.user.subscribe((auth) => {
                if (auth) {
                    if (
                        +auth.email_verify &&
                        auth.first_name &&
                        +auth.bank_verify &&
                        +auth.activation
                    ) {
                        resolve(
                            this.router.parseUrl('/user/placement-settings')
                        );
                    } else {
                        resolve(true);
                    }
                } else {
                    resolve(this.router.parseUrl('/login'));
                    this.router.navigateByUrl('/login');
                }
            });
        });
    }
}
