import { Component, OnInit } from '@angular/core';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { NgwWowService } from 'ngx-wow';
import { StorageService } from 'src/app/data/services/storage.service';
import { ProductService } from 'src/app/data/services/guest/product.service';
import { AuthService } from 'src/app/data/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-carts',
  templateUrl: './shopping-carts.component.html',
  styleUrls: ['./shopping-carts.component.scss']
})
export class ShoppingCartsComponent implements OnInit {

    webset;

    theMessage: any;
    showNotice = false;
    deleteModal = false;
    justMssg = false;
    removeCart = false;
    removeCartAuth = false;

    isLoading = true;

    isAddingCart = false;
    auth;

    constructor(
        private wowService: NgwWowService,
        private storageService: StorageService,
        private productService: ProductService,
        private generalSettingsServices: GeneralSettingsService,
        private authS: AuthService,
        private router: Router,
    ) {
        this.wowService.init();
    }

    ngOnInit(): void {
        this.getAuth();
        this.getSettings();
        this.theCartList();
        this.getNewList()
    }


    private getAuth() {
        this.authS.user.subscribe(auth => {
          this.auth = auth;
        })
    }


    private getSettings(){
        this.generalSettingsServices.genSettings.subscribe(res => {
            if(res){
                this.webset = res.websiteSettings
            }
        })
    }


    carts = [];
    totalCartAmt = 0;
    private async theCartList(){
        if(this.auth){
            this.productService.getCarts().subscribe(res => {
                if(res){
                    this.carts = res.data;
                    this.totalCartAmt = 0;
                    if(this.carts){
                        for (let i = 0; i < this.carts.length; i++) {
                        this.totalCartAmt += this.carts[i].qty * this.carts[i].sales_price;
                        }
                    }
                }
            })
        } else {
            const data =  await this.storageService.getString('storeCarts');
            this.carts = JSON.parse(data);

            if(this.carts){
                this.totalCartAmt = 0;
                for (let i = 0; i < this.carts.length; i++) {
                    this.totalCartAmt += this.carts[i].qty * this.carts[i].sales_price;
                }
            }
        }
        this.isLoading = false;
    }


    private getNewList(){
        this.productService.theCartList.subscribe(res => {
            this.carts = res
            this.totalCartAmt = 0;
            if(this.carts){
                for (let i = 0; i < this.carts.length; i++) {
                  this.totalCartAmt += this.carts[i].qty * this.carts[i].sales_price;
                }
            }
        })
    }

    returnID;
    async deleteEachCart(warning, arrNum){
        if (warning) {
            this.showNotice = true;
            this.deleteModal = false;
            this.removeCart = true;
            this.justMssg = false;
            this.theMessage = "Are you sure you want to REMOVE from cart?";
            this.returnID = arrNum;
          } else {
            this.isAddingCart = true;
            this.showNotice = false;
            const resp = await this.productService.removeFromCart(arrNum);
            setTimeout(() => {
                this.isAddingCart = false;
              }, 500);

        }
    }

    async addMinus(pid, role){
        this.isAddingCart = true;
        const resp = await this.productService.toAddOrMinus(pid, role);

        if(resp == 'noMoreAdd'){
            this.theMessage = "You can no longer add more of this product.";
            this.showNotice = true;
            this.justMssg = false;
            this.removeCart = false;
            this.deleteModal = true;
            this.isAddingCart = false;
        } else if(resp == 'noMoreMinus'){
            this.theMessage = "You can no longer reduce of this product.";
            this.showNotice = true;
            this.justMssg = false;
            this.removeCart = false;
            this.deleteModal = true;
            this.isAddingCart = false;
        } else {
            setTimeout(() => {
                this.isAddingCart = false;
            }, 500);
        }
    }

    removeNotice() {
        setTimeout(() => {
          if (this.showNotice = true) {
            this.showNotice = false;
          }
        }, 4000);
    }

    closeMyNotice() {
        this.showNotice = false;
    }

    goToVheckout(){
        if(this.auth){
            this.router.navigateByUrl('/user/checkout');
        } else {
            this.storageService.storeString('comingFrom', "to-login");
            this.router.navigateByUrl('/login');
        }
    }

    //auth carts

    returnCartID;
    deleteEachCartAuth(warning, cartID){
        if (warning) {
            this.showNotice = true;
            this.deleteModal = false;
            this.removeCart = false;
            this.justMssg = false;
            this.removeCartAuth = true;
            this.theMessage = "Are you sure you want to REMOVE from cart?";
            this.returnCartID = cartID;
          } else {
            this.isAddingCart = true;
            this.showNotice = false;
            this.productService.deleteCart(cartID).subscribe(res => {
                if(res){
                    this.carts = res.data;
                    this.totalCartAmt = 0;
                    if(this.carts){
                        for (let i = 0; i < this.carts.length; i++) {
                        this.totalCartAmt += this.carts[i].qty * this.carts[i].sales_price;
                        }
                    }
                }
            });
            this.isAddingCart = false;
        }
    }


    addMinusAuth(cartID, role){
        this.productService.authAddMinusCart(cartID, role).subscribe(res => {
            if(res){
                this.carts = res.data;
                this.totalCartAmt = 0;
                if(this.carts){
                    for (let i = 0; i < this.carts.length; i++) {
                    this.totalCartAmt += this.carts[i].qty * this.carts[i].sales_price;
                    }
                }
            }
        })
    }

}
