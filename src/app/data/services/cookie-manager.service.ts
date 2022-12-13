import { APP_ID, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CookieDict, CookieService } from 'ngx-cookie';

@Injectable({
  providedIn: 'root'
})
export class CookieManagerService {
  // cookieValue!: string;
  // objectCookieValue?: object;
  // hasCookieTrue!: boolean;
  // hasCookieFalse!: boolean;
  // allCookies: CookieDict = {};

  // private key = 'myCookie';
  // private objectKey = 'myObjectCookie';

  constructor(
    // @Inject(PLATFORM_ID) private platformId: Object,
    // @Inject(APP_ID) private appId: string,
    private cookieService: CookieService
  ) {
    // console.log(`Running in the ${platformId} with appId=====${appId}`);
  }

  setStringCookies(key: string, value: string): void {
    this.cookieService.put(key, value);
  }

  hasKey(key): boolean {
    return this.cookieService.hasKey(key)
  }

  hasObjectKey(key): boolean {
    return this.cookieService.hasKey(key);
  }

  setObjCookies(key: string, value: object) {
    this.cookieService.putObject(key, value);
  }

  getAllCookies(): CookieDict {
    return this.cookieService.getAll();
  }

  getStringCookie(key): string {
    return this.cookieService.get(key);
  }

  getObjCookies(key): any {
    return this.cookieService.getObject(key);
  }

  removeCookieString(key) {
    this.cookieService.remove(key);
  }

  // getCookies(): void {
  //   this.cookieValue = this.cookieService.get(this.key);
  //   this.objectCookieValue = this.cookieService.getObject(this.objectKey);
  //   this.hasCookieTrue = this.cookieService.hasKey(this.key) && this.cookieService.hasKey(this.objectKey);
  //   this.hasCookieFalse = this.cookieService.hasKey('nonExistentKey');
  //   this.allCookies = this.cookieService.getAll();
  // }

  
}
