import { Component, OnInit } from '@angular/core';
import { NgwWowService } from 'ngx-wow';
import { ContentsService } from 'src/app/data/services/guest/contents.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    isLoading = true;

    constructor(
        private wowService: NgwWowService,
        private contentService: ContentsService,
    ) {
        this.wowService.init();
    }


    testimonies = []


    slideResizeConfig = [
        { minW: 1170, slideNo: 2 },
        { minW: 800, maxW: 1170, slideNo: 2 },
        { minW: 500, maxW: 800, slideNo: 1 },
        { maxW: 500, slideNo: 1 },
    ];

    partnersResizeConfig = [
        { minW: 800, slideNo: 4 },
        { minW: 600, maxW: 800, slideNo: 3 },
        { minW: 400, maxW: 600, slideNo: 2 },
        { maxW: 400, slideNo: 1 },
    ];

    sliders;
    about;
    config;
    recentProjects;
    topServices;
    // testimonies = [];
    whyus;

    ngOnInit(): void {
        this.allThisContent()
    }


    private allThisContent(){
        this.contentService.homeContent().subscribe(res => {
            if(res){
                this.sliders = res.data.sliders;
                this.about = res.data.about;
                this.config = res.data.config;
                this.recentProjects = res.data.recentProject;
                this.topServices = res.data.services;
                this.testimonies = res.data.testimonies;
                this.whyus = res.data.why_us;
            }
            this.isLoading = false;
        })
    }

    activeOne = 1;
    nextTheTab(adv){
        this.activeOne = adv;
    }

}
