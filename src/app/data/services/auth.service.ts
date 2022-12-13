import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { ConfigService } from './config.service';
import { StorageService } from './storage.service';
import { ReferralService } from './user/referral.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private baseUrl;
    constructor(
        private http: HttpClient,
        private storageS: StorageService,
        private configS: ConfigService,
        private router: Router,
        private refS: ReferralService
    ) {
        this.baseUrl = configS.baseUrl;
    }

    private _auth = new BehaviorSubject(null);
    checking = new BehaviorSubject(true);

    get user() {
        return this._auth.asObservable();
    }

    login(data) {
        return this.http.post<any>(`${this.baseUrl}login`, data).pipe(
            tap((res) => {
                this.updateAuth(res.data);
                this.storageS.remove('storeCarts');
                this.router.navigateByUrl('/user/dashboard');
            })
        );
    }

    changePass(data) {
        return this.http.post<any>(
            `${this.baseUrl}user/account-settings/change-password`,
            data
        );
    }

    register(data) {
        return this.http
            .post<any>(`${this.baseUrl}register`, data)
            .pipe(
                tap((res) => {
                    console.log(res)
                    this.updateAuth(res.data);
                    // this.router.navigateByUrl('/user/verify-email');
                })
            );
    }

    verifyEmail(data) {
        return this.http.post<any>(`${this.baseUrl}verification`, data).pipe(
            tap((res) => {
                this.updateAuth(res.data);
                this.router.navigateByUrl('/user/personal-info');
            })
        );
    }

    activateUser(data) {
        return this.http
            .post<any>(`${this.baseUrl}user/activation-payment`, data)
            .pipe(
                tap((res) => {
                    this.updateAuth(res.data);
                })
            );
    }

    resendEmailVerifyCode() {
        return this.http.get<any>(`${this.baseUrl}verification/resend`);
    }

    updateAuth(auth) {
        this._auth.next(auth);
        this.storageS.storeString('userData', JSON.stringify(auth));
    }

    updateProfile(data) {
        return this.http
            .put<any>(`${this.baseUrl}user/settings/update-profile`, data)
            .pipe(
                tap((res) => {
                    this.updateAuth(res.data);
                })
            );
    }

    async autoLogin() {
        const auth = await this.storageS.getString('userData');
        const signupUser = await this.storageS.getString('currentSignupUser');
        const userBank = await this.storageS.getString('userBank');
        this.refS.currentSignupUser = signupUser
            ? JSON.parse(signupUser)
            : null;
        this.refS.userBank = userBank ? JSON.parse(userBank) : null;
        this._auth.next(auth ? JSON.parse(auth) : null);
        this.checking.next(false);
    }

    logout() {
        this._auth.next(null);
        this.storageS.remove('userData');
        this.storageS.remove('storeCarts');
        localStorage.clear();
        // this.router.navigateByUrl('/login');
    }

    forgotPassword(data) {
        return this.http.post<any>(`${this.baseUrl}forgot-password`, data);
    }

    verifyPassCode(data) {
        return this.http.post<any>(`${this.baseUrl}forgot-password/verify`, data);
    }

    resetPassword(data) {
        return this.http.post<any>(`${this.baseUrl}forgot-password/reset-password`, data);
    }
}
