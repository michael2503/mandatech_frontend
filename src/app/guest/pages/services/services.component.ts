import { Component, OnInit } from '@angular/core';
import { NgwWowService } from 'ngx-wow';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { ContentsService } from 'src/app/data/services/guest/contents.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

    isLoading = true;

    // services = [
    //     {
    //         banner:'/assets/images/services/featured-image-3.jpg',
    //         title: 'Solar Panels Installation',
    //         sub_title: 'WITH MOST SUNLIGHT CONVERSION EFFICIENCY',
    //         icon: 'flaticon-power-2',
    //         id: '1',
    //         contents: 'Aenean volutpat, sem sit amet ullamcorper gravida, tortor arcu molestie risus, ut bibendum urna enim nulla. Pellentesque porta arcu velit, faucibus kodales dolor rhoncus sed. Curabitur lacinia massa vitae efficitur porttitor. Sed scelerisque vestibulum lectus, at egestas erat varius.',
    //     },
    //     {
    //         banner:'/assets/images/services/featured-image-4-1.jpg',
    //         title: 'Solar Maintenance Services',
    //         sub_title: 'INSPECTION TO PREVENT EMERGENCY REPAIR',
    //         icon: 'flaticon-settings-1',
    //         id: '2',
    //         contents: 'Aenean volutpat, sem sit amet ullamcorper gravida, tortor arcu molestie risus, ut bibendum urna enim nulla. Pellentesque porta arcu velit, faucibus kodales dolor rhoncus sed. Curabitur lacinia massa vitae efficitur porttitor. Sed scelerisque vestibulum lectus, at egestas erat varius',
    //     },
    //     {
    //         banner:'/assets/images/services/featured-image-5-1.jpg',
    //         title: 'Replacement Upgrade',
    //         sub_title: 'GET YOUR PANELS IN GOOD SHAPE REGULARLY',
    //         icon: 'flaticon-energy-1',
    //         id: '3',
    //         contents: 'Aenean volutpat, sem sit amet ullamcorper gravida, tortor arcu molestie risus, ut bibendum urna enim nulla. Pellentesque porta arcu velit, faucibus kodales dolor rhoncus sed. Curabitur lacinia massa vitae efficitur porttitor. Sed scelerisque vestibulum lectus, at egestas erat varius',
    //     },
    //     {
    //         banner:'/assets/images/services/featured-image-5-1.jpg',
    //         title: 'Commercial Services',
    //         sub_title: 'GET YOUR PANELS IN GOOD SHAPE REGULARLY',
    //         icon: 'flaticon-nuclear-plant',
    //         id: '4',
    //         contents: 'Aenean volutpat, sem sit amet ullamcorper gravida, tortor arcu molestie risus, ut bibendum urna enim nulla. Pellentesque porta arcu velit, faucibus kodales dolor rhoncus sed. Curabitur lacinia massa vitae efficitur porttitor. Sed scelerisque vestibulum lectus, at egestas erat varius',
    //     },
    //     {
    //         banner:'/assets/images/services/featured-image-5-1.jpg',
    //         title: 'Thermal Systems',
    //         sub_title: 'GET YOUR PANELS IN GOOD SHAPE REGULARLY',
    //         icon: 'flaticon-solar-panel',
    //         id: '5',
    //         contents: 'Aenean volutpat, sem sit amet ullamcorper gravida, tortor arcu molestie risus, ut bibendum urna enim nulla. Pellentesque porta arcu velit, faucibus kodales dolor rhoncus sed. Curabitur lacinia massa vitae efficitur porttitor. Sed scelerisque vestibulum lectus, at egestas erat varius',
    //     },
    //     {
    //         banner:'/assets/images/services/featured-image-5-1.jpg',
    //         title: 'Residential EV Charges',
    //         sub_title: 'GET YOUR PANELS IN GOOD SHAPE REGULARLY',
    //         icon: 'flaticon-oil-2',
    //         id: '6',
    //         contents: 'Aenean volutpat, sem sit amet ullamcorper gravida, tortor arcu molestie risus, ut bibendum urna enim nulla. Pellentesque porta arcu velit, faucibus kodales dolor rhoncus sed. Curabitur lacinia massa vitae efficitur porttitor. Sed scelerisque vestibulum lectus, at egestas erat varius',
    //     },
    // ];


    // clients = [
    //     { logo:'/assets/images/clients/1.png' },
    //     { logo:'/assets/images/clients/2.webp' },
    //     { logo:'/assets/images/clients/3.png' },
    //     { logo:'/assets/images/clients/4.png' },
    //     { logo:'/assets/images/clients/5.png' },
    // ];


    clientResizeConfig = [
        { minW: 800, slideNo: 4 },
        { minW: 600, maxW: 800, slideNo: 3 },
        { minW: 400, maxW: 600, slideNo: 2 },
        { maxW: 400, slideNo: 1 },
      ];

    constructor(
        private wowService: NgwWowService,
        private contentService: ContentsService,
        private generalSettingService: GeneralSettingsService,
    ) {
        this.wowService.init();
    }

    ngOnInit(): void {
        this.genSetting();
        this.allThisContent()
    }

    services = [];
    clients = [];
    webSet;
    ourServices;

    private genSetting(){
        this.generalSettingService.genSettings.subscribe(res => {
            if(res){
                this.webSet = res.websiteSettings;
                this.ourServices = res.services
            }
        })
    }


    private allThisContent(){
        this.contentService.serviceContent().subscribe(res => {
            console.log(res);
            if(res){
                this.services = res.data.services;
                this.clients = res.data.clients;
            }
            this.isLoading = false;
        })
    }

}
