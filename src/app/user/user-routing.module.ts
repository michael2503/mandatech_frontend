import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressesComponent } from './pages/addresses/addresses.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { CouponsComponent } from './pages/coupons/coupons.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrderDetailsComponent } from './pages/order-details/order-details.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ChangePasswordComponent } from './pages/settings/change-password/change-password.component';
import { ProfileComponent } from './pages/settings/profile/profile.component';

const routes: Routes = [
    { path: '', redirectTo: '/user/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'address', component: AddressesComponent },
    { path: 'checkout', component: CheckoutComponent },

    { path: 'order-manager', redirectTo: '/user/order-manager/all', pathMatch: 'full' },
    { path: 'order-manager/:status', component: OrdersComponent },
    { path: 'order-manager/details/:orderNumber', component: OrderDetailsComponent },

    { path: 'coupon', component: CouponsComponent },
    { path: 'settings/profile', component: ProfileComponent },
    { path: 'settings/change-password', component: ChangePasswordComponent },



    // { path: 'order-manager', component: OrdersComponent },
    // { path: 'order-manager/delivered', component: OrdersComponent },
    // { path: 'order-manager/pending', component: OrdersComponent },
    // { path: 'order-manager/cancelled', component: OrdersComponent },
    // { path: 'order-manager/all', component: OrdersComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
