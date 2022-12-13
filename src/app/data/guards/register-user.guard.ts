import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ReferralService } from '../services/user/referral.service';

@Injectable({
    providedIn: 'root',
})
export class RegisterUserGuard implements CanActivate {
    constructor(
        private refS: ReferralService,
        private authS: AuthService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return new Promise((resolve) => {
            this.authS.checking.subscribe((checking) => {
                if (!checking) {
                    resolve(
                        !!this.refS.currentSignupUser ||
                            this.router.parseUrl('/user/business/register')
                    );
                }
            });
        });
    }
}
