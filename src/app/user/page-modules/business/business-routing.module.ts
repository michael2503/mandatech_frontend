import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstPageComponent } from './activate-package/first-page/first-page.component';
import { FirstPageComponent as UpgradeFirstPage } from './upgrade-package/first-page/first-page.component';
import { OrderSummaryComponent as UpgradeOrderSummaryComponent } from './upgrade-package/order-summary/order-summary.component';
import { OrderSummaryComponent } from './activate-package/order-summary/order-summary.component';
import { ActivateComponent } from './register/activate/activate.component';
import { ConfirmDetailsComponent } from './register/confirm-details/confirm-details.component';
import { PaymentInfoComponent } from './register/payment-info/payment-info.component';
import { PersonalInfoComponent } from './register/personal-info/personal-info.component';
import { PlacementComponent } from './register/placement/placement.component';
import { PackageUpgradeHistoryComponent } from './package-upgrade-history/package-upgrade-history.component';
import { RegisterUserGuard } from 'src/app/data/guards/register-user.guard';
import { CheckoutGuard } from 'src/app/data/guards/checkout.guard';

const routes: Routes = [
    { path: '', redirectTo: '/user/business/register', pathMatch: 'full' },
    { path: 'register', component: PlacementComponent },
    {
        path: 'register/personal-info',
        component: PersonalInfoComponent,
        canActivate: [RegisterUserGuard],
    },
    {
        path: 'register/personal-info/edit',
        component: PersonalInfoComponent,
        canActivate: [RegisterUserGuard],
    },
    {
        path: 'register/payment-info',
        component: PaymentInfoComponent,
        canActivate: [RegisterUserGuard],
    },
    {
        path: 'register/confirm-details',
        component: ConfirmDetailsComponent,
        canActivate: [RegisterUserGuard],
    },
    {
        path: 'register/activate',
        component: ActivateComponent,
        canActivate: [RegisterUserGuard],
    },
    {
        path: 'activate-package',
        component: FirstPageComponent,
    },
    {
        path: 'activate-package/order-summary',
        component: OrderSummaryComponent,
        canActivate: [CheckoutGuard],
    },
    {
        path: 'package-upgrade',
        component: UpgradeFirstPage,
    },
    {
        path: 'package-upgrade/order-summary',
        component: UpgradeOrderSummaryComponent,
    },
    {
        path: 'package-upgrade-history',
        component: PackageUpgradeHistoryComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BusinessRoutingModule {}
