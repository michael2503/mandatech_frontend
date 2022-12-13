import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestRoutingModule } from './guest-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { TestimonialsComponent } from './pages/testimonials/testimonials.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AboutComponent } from './pages/about/about.component';
import { SharedModule } from '../shared/shared.module';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ServicesComponent } from './pages/services/services.component';
import { ServiceSingleComponent } from './pages/service-single/service-single.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductSingleComponent } from './pages/product-single/product-single.component';
import { RequestQuoteComponent } from './pages/request-quote/request-quote.component';
import { ShoppingCartsComponent } from './pages/shopping-carts/shopping-carts.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { GetQuoteComponent } from './pages/get-quote/get-quote.component';

@NgModule({
  declarations: [
    HomeComponent,
    TestimonialsComponent,
    LoginComponent,
    RegisterComponent,
    AboutComponent,
    ContactUsComponent,
    ServicesComponent,
    ServiceSingleComponent,
    ProjectsComponent,
    ProductsComponent,
    ProductSingleComponent,
    RequestQuoteComponent,
    ShoppingCartsComponent,
    ForgotPasswordComponent,
    GetQuoteComponent,
  ],
  imports: [CommonModule, GuestRoutingModule, SharedModule],
})
export class GuestModule {}
