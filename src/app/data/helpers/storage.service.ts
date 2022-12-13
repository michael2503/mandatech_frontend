import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CookieManagerService } from '../services/cookie-manager.service';
import * as localforage from 'localforage';

@Injectable({ providedIn: 'root' })
export class StorageService {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cookieManagerService: CookieManagerService,
  ) { }

  storeString(key: string, value: string) {
    if (isPlatformBrowser(this.platformId)) {
      localforage.setItem(key, value);
      // localStorage.setItem(key, value);
      if (key == 'userData') {
        this.cookieManagerService.setStringCookies(key, value);
      }
    }
  }

  async hasKey(key: string) {
    return isPlatformBrowser(this.platformId) ? !!await localforage.getItem(key) : this.cookieManagerService.hasKey(key);
  }

  async getString(key: string) {
    let retValue;
    if (isPlatformBrowser(this.platformId)) {
      retValue = await localforage.getItem(key);
    } else {
      retValue = this.cookieManagerService.getStringCookie(key);
    }
    return retValue;
  }

  remove(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      localforage.removeItem(key);
    }
    this.cookieManagerService.removeCookieString(key);
  }
}
