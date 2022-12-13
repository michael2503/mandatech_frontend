import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/data/services/auth.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { ProductService } from 'src/app/data/services/guest/product.service';
import { StorageService } from 'src/app/data/services/storage.service';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss']
})
export class HomeHeaderComponent implements OnInit {
    @Input() activePage;
    isShow = true;

    stickyHeader = false;
    isStickBar = false;

    auth;


    services = [
        {
            banner:'/assets/images/services/featured-image-3.jpg',
            title: 'Solar Panels Installation',
            sub_title: 'WITH MOST SUNLIGHT CONVERSION EFFICIENCY',
            icon: 'flaticon-power-2',
            id: '1',
            contents: 'Aenean volutpat, sem sit amet ullamcorper gravida, tortor arcu molestie risus, ut bibendum urna enim nulla. Pellentesque porta arcu velit, faucibus kodales dolor rhoncus sed. Curabitur lacinia massa vitae efficitur porttitor. Sed scelerisque vestibulum lectus, at egestas erat varius.',
        },
        {
            banner:'/assets/images/services/featured-image-4-1.jpg',
            title: 'Solar Maintenance Services',
            sub_title: 'INSPECTION TO PREVENT EMERGENCY REPAIR',
            icon: 'flaticon-settings-1',
            id: '2',
            contents: 'Aenean volutpat, sem sit amet ullamcorper gravida, tortor arcu molestie risus, ut bibendum urna enim nulla. Pellentesque porta arcu velit, faucibus kodales dolor rhoncus sed. Curabitur lacinia massa vitae efficitur porttitor. Sed scelerisque vestibulum lectus, at egestas erat varius',
        },
        {
            banner:'/assets/images/services/featured-image-5-1.jpg',
            title: 'Replacement Upgrade',
            sub_title: 'GET YOUR PANELS IN GOOD SHAPE REGULARLY',
            icon: 'flaticon-energy-1',
            id: '3',
            contents: 'Aenean volutpat, sem sit amet ullamcorper gravida, tortor arcu molestie risus, ut bibendum urna enim nulla. Pellentesque porta arcu velit, faucibus kodales dolor rhoncus sed. Curabitur lacinia massa vitae efficitur porttitor. Sed scelerisque vestibulum lectus, at egestas erat varius',
        },
        {
            banner:'/assets/images/services/featured-image-5-1.jpg',
            title: 'Commercial Services',
            sub_title: 'GET YOUR PANELS IN GOOD SHAPE REGULARLY',
            icon: 'flaticon-nuclear-plant',
            id: '4',
            contents: 'Aenean volutpat, sem sit amet ullamcorper gravida, tortor arcu molestie risus, ut bibendum urna enim nulla. Pellentesque porta arcu velit, faucibus kodales dolor rhoncus sed. Curabitur lacinia massa vitae efficitur porttitor. Sed scelerisque vestibulum lectus, at egestas erat varius',
        },
        {
            banner:'/assets/images/services/featured-image-5-1.jpg',
            title: 'Thermal Systems',
            sub_title: 'GET YOUR PANELS IN GOOD SHAPE REGULARLY',
            icon: 'flaticon-solar-panel',
            id: '5',
            contents: 'Aenean volutpat, sem sit amet ullamcorper gravida, tortor arcu molestie risus, ut bibendum urna enim nulla. Pellentesque porta arcu velit, faucibus kodales dolor rhoncus sed. Curabitur lacinia massa vitae efficitur porttitor. Sed scelerisque vestibulum lectus, at egestas erat varius',
        },
        {
            banner:'/assets/images/services/featured-image-5-1.jpg',
            title: 'Residential EV Charges',
            sub_title: 'GET YOUR PANELS IN GOOD SHAPE REGULARLY',
            icon: 'flaticon-oil-2',
            id: '6',
            contents: 'Aenean volutpat, sem sit amet ullamcorper gravida, tortor arcu molestie risus, ut bibendum urna enim nulla. Pellentesque porta arcu velit, faucibus kodales dolor rhoncus sed. Curabitur lacinia massa vitae efficitur porttitor. Sed scelerisque vestibulum lectus, at egestas erat varius',
        },
    ];


    constructor(
        private generalSettingService: GeneralSettingsService,
        private productService: ProductService,
        private storageService: StorageService,
        private authService: AuthService,
    ) { }

    ngOnInit(): void {
        this.getAuth();
        this.scrollCheck();
        this.genSetting();
        this.getDefaultCart();
        this.getNew()
    }

    private getAuth() {
        this.authService.user.subscribe(auth => {
          this.auth = auth;
        })
    }

    private scrollCheck() {
        const html = document.getElementsByTagName('html')[0];
        html.style.overflowY = "auto";
        window.onscroll = () => {
        const header = document.getElementsByTagName('header')[0];
        if (html.scrollTop >= header.clientHeight) {
            this.stickyHeader = true;
            this.isStickBar = true;
        } else {
            this.stickyHeader = false;
            this.isStickBar = false;
        }
        }
    }

    NoShowAgain(){
        // this.isShow = false;
    }

    webSet;
    ourServices = [];

    private genSetting(){
        this.generalSettingService.genSettings.subscribe(res => {
            if(res){
                this.webSet = res.websiteSettings;
                this.ourServices = res.services
            }
        })
    }

    isMobile = false;
    theToggler(){
        this.isMobile = true;
    }
    closeMobile(){
        this.isMobile = false;
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
            const carts = res;
            console.log(res)
            if(carts){
                this.cartCount = 0;
                for (let i = 0; i < carts.length; i++) {
                  this.cartCount += carts[i].qty;
                }
            }
        })
    }

}
