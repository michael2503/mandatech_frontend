import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../config.service';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

    private baseUrl;
    currentSignupUser;

    constructor(
        private http: HttpClient,
        private configS: ConfigService,
        private storageS: StorageService
    ) {
        this.baseUrl = configS.baseUrl;
    }



    getAllOrder(status, limit = 10, page = 1) {
        return this.http.get<any>(
            this.baseUrl + '/user/order-manager/' + status + '/' + limit + '/' + page
        );
    }

    getOrderSingle(orderNum) {
        return this.http.get<any>(
            this.baseUrl + '/user/order-manager/single/' + orderNum
        );
    }
}
