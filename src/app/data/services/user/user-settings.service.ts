import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {

    private baseUrl;

    constructor(
        private http: HttpClient,
        private configS: ConfigService
    ) {
        this.baseUrl = configS.baseUrl;
    }



    getAllAddress(){
        return this.http.get<any>(
            this.baseUrl + '/user/settings/address'
        )
    }

    addAddress(data){
        return this.http.post<any>(
            this.baseUrl + '/user/settings/address/add', data
        )
    }

    updateAddress(data){
        return this.http.put<any>(
            this.baseUrl + '/user/settings/address/update', data
        )
    }

    deleteAddress(id){
        return this.http.delete<any>(
            this.baseUrl + '/user/settings/address/delete/' + id
        )
    }


    updateProdfile(data){
        return this.http.put<any>(
            this.baseUrl + '/user/settings/update-profile', data
        )
    }

    getCoupons(limit, page){
        return this.http.get<any>(
            this.baseUrl + '/user/coupons/' + limit + '/' + page
        )
    }

    searchCoupon(keywords) {
        return this.http.get<any>(
          this.baseUrl + '/user/coupons/search/' + keywords
        );
    }

    dashboard(){
        return this.http.get<any>(
            this.baseUrl + '/user/dashboard-info'
        )
    }

    changePassword(data){
        return this.http.post<any>(
            this.baseUrl + '/user/settings/change-password', data
        )
    }


}
