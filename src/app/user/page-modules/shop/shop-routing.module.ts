import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsCollectedComponent } from './products-collected/products-collected.component';
import { ProductsNotCollectedComponent } from './products-not-collected/products-not-collected.component';
import { FirstPageComponent } from './repurchase-mall/first-page/first-page.component';
import { OrderSummaryComponent } from './repurchase-mall/order-summary/order-summary.component';

const routes: Routes = [
  { path: 'repurchase-mall', component: FirstPageComponent },
  { path: 'repurchase-mall/order-summary', component: OrderSummaryComponent },
  { path: 'products-not-collected', component: ProductsNotCollectedComponent },
  { path: 'products-collected', component: ProductsCollectedComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}
