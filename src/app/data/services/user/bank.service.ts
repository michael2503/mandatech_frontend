import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { AuthService } from '../auth.service';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private baseUrl;
  private auth;

  constructor(
    private http: HttpClient,
    private configS:  ConfigService,
    private authS: AuthService
  ) {
    this.baseUrl = configS.baseUrl;
    const authSub = authS.user.subscribe(auth => {
      this.auth = auth;
    })
    authSub.unsubscribe();
  }

  updateBank(data) {
    return this.http.post<any>(
      `${this.baseUrl}user/account-settings/bank-update`, data
    ).pipe(tap(_ => {
      this.authS.updateAuth({...this.auth, bank_verify: 1});
    }))
  }

  getBanks() {
    return this.http.get<any>(
      `${this.baseUrl}user/bank-info`
    )
  }
}
