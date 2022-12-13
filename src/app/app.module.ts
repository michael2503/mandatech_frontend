import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CookieModule } from 'ngx-cookie';
import { NgxGoogleAnalyticsModule } from 'ngx-google-analytics';
// import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule  } from 'ngx-google-analytics';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderInterceptorService } from './data/services/header-interceptor.service';
// import { CategoryComponent } from './administrator/product-manager/components/category/category.component';

@NgModule({
  declarations: [
    AppComponent,
],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CookieModule.forRoot(),
    NgxGoogleAnalyticsModule.forRoot('UA-248685084-1'),
    // NgxGoogleAnalyticsRouterModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
