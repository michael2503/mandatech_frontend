import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
    NavigationCancel,
    NavigationEnd,
    NavigationStart,
    Router,
} from '@angular/router';
import { AuthService } from './data/services/auth.service';
import { GeneralSettingsService } from './data/services/general-settings.service';
import { CartService } from './data/services/guest/cart.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'Mandatech Group';
    isLoading = true;

    // declare const gtag: Function;


    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private authS: AuthService,
        private router: Router,
        private cartS: CartService,
        private genS: GeneralSettingsService
    ) {
        // this.router.events.subscribe((event) => {
        //     if (event instanceof NavigationEnd) {
        //       this.gtag('config', 'UA-248685084-1', { 'page_path': event.urlAfterRedirects });
        //     }
        // })
    }

    ngOnInit(): void {
        this.getGenSetts();
        this.getLocalCarts();
        this.autoLogin();
        this.routerEventListener();
        this.resizeFunc();
        window.onresize = () => {
            this.resizeFunc();
        };
    }

    resizeFunc = () => {
        document.documentElement.style.setProperty(
            '--view-height',
            `${window.innerHeight - 1}px`
        );
    };

    private getGenSetts() {
        this.genS.getGenSettings().subscribe();
    }

    private getLocalCarts() {
        this.cartS.getLocalCarts();
    }

    private routerEventListener() {
        this.router.events.subscribe((e) => {
            if (e instanceof NavigationStart) {
                this.isLoading = true;
            } else if (e instanceof NavigationEnd) {
                this.isLoading = false;
                if (!e.url.match(/(\/login|\/register)/)) {
                    if (!isPlatformBrowser(this.platformId)) return;
                    localStorage.removeItem('returnUrl');
                }
            } else if (
                e instanceof NavigationCancel &&
                e.url.match(/(\/user|\/distributor\/auth)/)
            ) {
                if (!isPlatformBrowser(this.platformId)) return;
                localStorage.setItem('returnUrl', e.url);
            }
        });
    }

    private autoLogin() {
        this.authS.autoLogin().then(() => {
            this.getCarts();
        });
    }
    private getCarts() {
        this.cartS.fetchCartOwner();
        this.cartS.getCarts().subscribe();
    }
}
