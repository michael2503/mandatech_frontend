import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { ConfigService } from '../config.service';

@Injectable({
    providedIn: 'root',
})
export class ContentsService {
    private baseUrl;

    constructor(private http: HttpClient, private configS: ConfigService) {
        this.baseUrl = configS.baseUrl;
    }

    homeContent(){
        return this.http.get<any>(
            this.baseUrl + '/content/home'
        );
    }

    aboutUsContent(){
        return this.http.get<any>(
            this.baseUrl + '/content/about-us'
        );
    }

    serviceContent(){
        return this.http.get<any>(
            this.baseUrl + '/content/service'
        );
    }

    serviceSingleContent(id, title){
        return this.http.get<any>(
            this.baseUrl + '/content/service/single/' + id + '/' + title
        );
    }


    projectContent(limit = 10, page = 1){
        return this.http.get<any>(
          this.baseUrl + '/content/projects/' + limit + '/' + page
        )
    }


}
