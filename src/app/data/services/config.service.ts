import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    constructor() {}

    baseUrl = 'https://api.mandatechgroup.com/backend/laravel/';
    // baseUrl = 'http://127.0.0.1:8000/';

    randStr(len) {
        let result = '',
            i;
        const chars =
            '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (i = len; i > 0; --i) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }
}
