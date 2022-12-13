import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserSharedModule } from '../../user-shared/user-shared.module';
import { NavBarComponent } from './nav-bar/nav-bar.component';


@NgModule({
  declarations: [
    ProfileComponent,
    PaymentDetailsComponent,
    ChangePasswordComponent,
    NavBarComponent
  ],
  imports: [
    CommonModule,
    UserSharedModule,
    AccountRoutingModule
  ]
})
export class AccountModule { }
