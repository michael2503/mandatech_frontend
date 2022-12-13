import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from 'src/app/data/services/config.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
    currYear = new Date().getFullYear();
    webset;
    curYear = new Date().getFullYear();
    services = [];

    constructor(
        private generalSettingsServices: GeneralSettingsService,
        private config: ConfigService
    ) {}

    ngOnInit(): void {
        this.getSettings();
    }



    private getSettings(){
        this.generalSettingsServices.genSettings.subscribe(res => {
            if(res){
                this.webset = res.websiteSettings
                this.services = res.services
            }
        })
    }


}
