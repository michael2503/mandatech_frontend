import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/data/services/auth.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { CartService } from 'src/app/data/services/guest/cart.service';

@Component({
    selector: 'app-user-sidemenu',
    templateUrl: './user-sidemenu.component.html',
    styleUrls: ['./user-sidemenu.component.scss'],
})
export class UserSidemenuComponent implements OnInit {
    activePageModule;

    @Input() mainpage;
    @Input() page;

    accOpenListiner = new BehaviorSubject(-1);
    webSet;

    constructor(
        private router: Router,
        private authS: AuthService,
        private generalSettingService: GeneralSettingsService,
    ) {}

    ngOnInit(): void {
        this.genSetting();
        // this.activePageModule = this.router.url.split('/')[2];
    }

    logout() {
        this.authS.logout();
        // window.location.replace("/");
        this.router.navigateByUrl('/');
        setTimeout(() => {

            // window.location.replace("/login");
        }, 5000);

    }


    private genSetting(){
        this.generalSettingService.genSettings.subscribe(res => {
            if(res){
                this.webSet = res.websiteSettings;
            }
        })
    }



    minimizeNav(){
        const theSideMenu = document.getElementById('theSideMenu')
        theSideMenu.style.width = '0px';
    }

}
