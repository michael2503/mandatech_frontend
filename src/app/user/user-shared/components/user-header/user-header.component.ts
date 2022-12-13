import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/data/services/auth.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { ProductService } from 'src/app/data/services/guest/product.service';
import { StorageService } from 'src/app/data/services/storage.service';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss']
})
export class UserHeaderComponent implements OnInit, OnDestroy {
    timerInterv;
    h;
    m;
    s;

    present;

    auth;
    authSub: Subscription;
    webSet;

    constructor(
        @Inject(DOCUMENT) private _document: any,
        private authS: AuthService,
        private productService: ProductService,
        private storageService: StorageService,
        private generalSettingService: GeneralSettingsService,
    ) { }

    ngOnDestroy(): void {
        this.authSub?.unsubscribe();
        clearInterval(this.timerInterv);
    }

    ngOnInit(): void {
        this.getAuth();
        this.startTimer();
        this.getDefaultCart();
        this.getNew();
        this.genSetting();
    }

    private genSetting(){
        this.generalSettingService.genSettings.subscribe(res => {
            if(res){
                this.webSet = res.websiteSettings;
            }
        })
    }

    private getAuth() {
        this.authSub = this.authS.user.subscribe(auth => {
            this.auth = auth;
        });
    }

    private startTimer() {
        this.timerInterv = setInterval(() => {
        this.present = new Date().toISOString();
        });
    }

    carts = [];
    cartCount = 0;
    private async getDefaultCart(){

        if(this.auth){
            this.productService.getCarts().subscribe(res => {
                if(res){
                    this.carts = res.data;
                    if(this.carts){
                        this.cartCount = 0;
                        for (let i = 0; i < this.carts.length; i++) {
                            this.cartCount += parseInt(this.carts[i].qty);
                        }
                    }
                }
            })
        } else {
            const data =  await this.storageService.getString('storeCarts');
            this.carts = JSON.parse(data);

            if(this.carts){
                this.cartCount = 0;
                for (let i = 0; i < this.carts.length; i++) {
                this.cartCount += parseInt(this.carts[i].qty);
                }
            }
        }
    }


    private getNew(){
        this.productService.theCartList.subscribe(res => {
            const carts = res
            if(carts){
                this.cartCount = 0;
                for (let i = 0; i < carts.length; i++) {
                  this.cartCount += carts[i].qty;
                }
            }
        })
    }

    // element: HTMLElement;


    theIcon = "fa-align-justify";
    minimizeNav(){
        const theSideMenu = this._document.getElementById('theSideMenu');
        theSideMenu.style.width = '260px';
    }



}
