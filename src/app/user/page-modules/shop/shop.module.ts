import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { FirstPageComponent } from './repurchase-mall/first-page/first-page.component';
import { OrderSummaryComponent } from './repurchase-mall/order-summary/order-summary.component';
import { ProductsNotCollectedComponent } from './products-not-collected/products-not-collected.component';
import { ProductsCollectedComponent } from './products-collected/products-collected.component';
import { UserSharedModule } from '../../user-shared/user-shared.module';

@NgModule({
  declarations: [
    FirstPageComponent,
    OrderSummaryComponent,
    ProductsNotCollectedComponent,
    ProductsCollectedComponent,
  ],
  imports: [CommonModule, UserSharedModule, ShopRoutingModule],
})
export class ShopModule {}
