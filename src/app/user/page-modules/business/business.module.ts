import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessRoutingModule } from './business-routing.module';
import { PlacementComponent } from './register/placement/placement.component';
import { PersonalInfoComponent } from './register/personal-info/personal-info.component';
import { PaymentInfoComponent } from './register/payment-info/payment-info.component';
import { ConfirmDetailsComponent } from './register/confirm-details/confirm-details.component';
import { ActivateComponent } from './register/activate/activate.component';
import { FirstPageComponent } from './activate-package/first-page/first-page.component';
import { OrderSummaryComponent } from './activate-package/order-summary/order-summary.component';
import { FirstPageComponent as UpgradeFirstPageComponent } from './upgrade-package/first-page/first-page.component';
import { OrderSummaryComponent as UpgradeOrderSummaryComponent } from './upgrade-package/order-summary/order-summary.component';
import { UserSharedModule } from '../../user-shared/user-shared.module';
import { PackageUpgradeHistoryComponent } from './package-upgrade-history/package-upgrade-history.component';
import { LayoutComponent } from './register/shared/layout/layout.component';
import { PhoneCodePipe } from 'src/app/shared/pipe/phone-code.pipe';
import { ProdPackagePipe } from 'src/app/shared/pipe/prod-package.pipe';


@NgModule({
  declarations: [
    PlacementComponent,
    PersonalInfoComponent,
    PaymentInfoComponent,
    ConfirmDetailsComponent,
    ActivateComponent,
    FirstPageComponent,
    OrderSummaryComponent,
    UpgradeFirstPageComponent,
    UpgradeOrderSummaryComponent,
    PackageUpgradeHistoryComponent,
    LayoutComponent,
  ],
  imports: [
    CommonModule,
    UserSharedModule,
    BusinessRoutingModule,
  ],
  providers: [PhoneCodePipe, ProdPackagePipe]
})
export class BusinessModule { }
