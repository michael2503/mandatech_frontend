import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { ConfigService } from '../config.service';
import { StorageService } from '../storage.service';

@Injectable({
    providedIn: 'root',
})
export class ReferralService {
    private baseUrl;
    currentSignupUser;
    userBank;

    constructor(
        private http: HttpClient,
        private configS: ConfigService,
        private storageS: StorageService
    ) {
        this.baseUrl = configS.baseUrl;
    }

    signupUser(data) {
        return this.http
            .post<any>(`${this.baseUrl}user/referral/create`, data)
            .pipe(
                tap((res) => {
                    this.removeUser();
                    this.updateUser(res.data);
                })
            );
    }

    removeUser() {
        this.currentSignupUser = null;
        this.userBank = null;
        this.storageS.remove('userBank');
        this.storageS.remove('currentSignupUser');
    }

    getDirectRefs(limit, page) {
        return this.http.get<any>(
            `${this.baseUrl}user/referral/direct-referral/${limit}/${page}`
        )
    }

    getDownlines() {
        return this.http.get<any>(
            `${this.baseUrl}user/referral/binary-tree`
        )
    }

    getUnilevels(limit, page) {
        return this.http.get<any>(
            `${this.baseUrl}user/referral/downlines/${limit}/${page}`
        )
    }

    updateBank(data) {
        return this.http
            .post<any>(`${this.baseUrl}user/referral/update-bank`, data)
            .pipe(
                tap((res) => {
                    this.updateUser({
                        ...this.currentSignupUser,
                        bank_verify: 1,
                    });
                    this.userBank = res.data;
                    this.storageS.storeString(
                        'userBank',
                        JSON.stringify(res.data)
                    );
                })
            );
    }

    getBalance() {
        return this.http.get<any>(
            `${this.baseUrl}user/referral/wallet/${this.currentSignupUser.id}`
        );
    }

    activateUser(data) {
        return this.http
            .post<any>(`${this.baseUrl}user/referral/activation-payment`, data)
            .pipe(
                tap((res) => {
                    this.updateUser(res.data);
                })
            );
    }

    updateUser(data) {
        this.currentSignupUser = data;
        this.storageS.storeString('currentSignupUser', JSON.stringify(data));
    }

    updateProfile(data) {
        return this.http
            .put<any>(`${this.baseUrl}user/referral/update`, data)
            .pipe(
                tap((res) => {
                    this.updateUser(res.data);
                })
            );
    }

    // getUser() {
    //   return this.http.get<any>(`${this.baseUrl}user/${this.currentSignupUser}`);
    // }
}
