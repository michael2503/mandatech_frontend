import { Component, OnInit } from '@angular/core';
import { NgwWowService } from 'ngx-wow';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

    webset;

    constructor(
        private wowService: NgwWowService,
        private generalSettingsServices: GeneralSettingsService,
    ) {
        this.wowService.init();
    }

    ngOnInit(): void {
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


}
