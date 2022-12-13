import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class UserProductService {

    private baseUrl;

    constructor(
        private http: HttpClient,
        private configS: ConfigService
    ) {
        this.baseUrl = configS.baseUrl;
    }

    cartCount = new BehaviorSubject(null);
    cartList = new BehaviorSubject(null);


    submitCheckout(data) {
        return this.http.post<any>(
            `${this.baseUrl}user/product/checkout`,
            data
        );
    }

    getCarts(){
        return this.http.get<any>(
            `${this.baseUrl}user/product/get-carts`,
        );
    }

    checkCoupon(couponCode){
        return this.http.get<any>(
            `${this.baseUrl}user/product/check-coupon/${couponCode}`,
        );
    }



}
