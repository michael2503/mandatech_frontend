import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../config.service';

@Injectable({
    providedIn: 'root',
})
export class WalletService {
    private baseUrl;

    constructor(private http: HttpClient, private configS: ConfigService) {
        this.baseUrl = configS.baseUrl;
    }

    getBalance() {
        return this.http.get<any>(`${this.baseUrl}user/transaction/info`);
    }

    getHistory(path, limit, page) {
        return this.http.get<any>(
            `${this.baseUrl}user/${path}/${limit}/${page}`
        );
    }

    voucherInfo() {
        return this.http.get<any>(`${this.baseUrl}user/voucher/info`);
    }

    generateVouch(data) {
        return this.http.post<any>(
            `${this.baseUrl}user/voucher/generate`,
            data
        );
    }

    fundWallet(data) {
        return this.http.post<any>(
            `${this.baseUrl}user/transaction/fund-wallet`,
            data
        );
    }

    transferFund(data) {
        return this.http.post<any>(
            `${this.baseUrl}user/transaction/transfer`,
            data
        );
    }

    getMasterWallet() {
        return this.http.get<any>(`${this.baseUrl}user/wallet/info`);
    }

    getTransHist(limit, page) {
        return this.http.get<any>(
            `${this.baseUrl}user/transaction/history/${limit}/${page}`
        );
    }

    withdraw(data) {
        return this.http.post<any>(
            `${this.baseUrl}user/withdrawal/request`,
            data
        );
    }

    getVouchers(limit, page) {
        return this.http.get<any>(
            `${this.baseUrl}`
        )
    }
}
