import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { ConfigService } from './config.service';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class GeneralSettingsService {
  private baseUrl;
  private settings = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private errorService: ErrorHandlerService
  ) {
    this.baseUrl = this.config.baseUrl;
  }

  get genSettings() {
    return this.settings.asObservable();
  }

  getGenSettings() {
    return this.http.get<any>(`${this.baseUrl}general-settings`).pipe(
      tap(
        (res) => {
          this.settings.next(res.data);
        },
        (err) => {
          this.errorService.errorResp.next(err);
        }
      )
    );
  }
}
