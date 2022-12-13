import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class HeaderInterceptorService implements HttpInterceptor {
    token;
    constructor(private authS: AuthService) {
        this.authS.user.subscribe((auth) => {
            this.token = auth?.token;
        });
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (this.token && !req.url.includes('api.cloudinary')) {
            return next.handle(req.clone({
                setHeaders: {
                  'Api-Token': this.token
                }
              }));
        }
        return next.handle(req);
    }
}
