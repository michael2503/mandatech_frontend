import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PhoneCodePipe } from '../shared/pipe/phone-code.pipe';
import { Angular4PaystackModule } from 'angular4-paystack';
import { UserSharedModule } from './user-shared/user-shared.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { OrderDetailsComponent } from './pages/order-details/order-details.component';
import { AddressesComponent } from './pages/addresses/addresses.component';
import { CouponsComponent } from './pages/coupons/coupons.component';
import { ProfileComponent } from './pages/settings/profile/profile.component';
import { ChangePasswordComponent } from './pages/settings/change-password/change-password.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CheckoutComponent,
    OrdersComponent,
    OrderDetailsComponent,
    AddressesComponent,
    CouponsComponent,
    ProfileComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    UserSharedModule,
    Angular4PaystackModule.forRoot(''),
  ],
  providers: [PhoneCodePipe],
})
export class UserModule {}
