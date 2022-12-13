import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgwWowService } from 'ngx-wow';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { ContentsService } from 'src/app/data/services/guest/contents.service';

@Component({
  selector: 'app-service-single',
  templateUrl: './service-single.component.html',
  styleUrls: ['./service-single.component.scss']
})
export class ServiceSingleComponent implements OnInit {


    services = [];
    title;
    serviceID;
    service;
    about;
    webset;

    constructor(
        private route: ActivatedRoute,
        private wowService: NgwWowService,
        private contentService: ContentsService,
        private generalSettingsServices: GeneralSettingsService,
    ) {
        this.wowService.init();
    }

    ngOnInit(): void {
        this.route.params.subscribe((param) => {
            this.title = param['title'];
            this.serviceID = param['id'];
            this.singleSeervice();
        });

        this.getSettings()
    }


    private getSettings(){
        this.generalSettingsServices.genSettings.subscribe(res => {
            console.log(res)
            if(res){
                this.webset = res.websiteSettings
            }
        })
    }

    private singleSeervice(){
        this.contentService.serviceSingleContent(this.serviceID, this.title).subscribe(res => {
            console.log(res)
            if(res){
                this.services = res.data.services
                this.service = res.data.single
                this.about = res.data.aboutUs
            }
        })
    }


}
