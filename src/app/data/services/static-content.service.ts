import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class StaticContentService {
  private baseUrl;
  constructor(private http: HttpClient, private configS: ConfigService) {
    this.baseUrl = configS.baseUrl;
  }

  getContent(page) {
    return this.http.get<any>(`${this.baseUrl}pages/${page}`);
  }
}
