import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { CartService } from 'src/app/data/services/guest/cart.service';
import { ProductService } from 'src/app/data/services/guest/product.service';
import { ProdPackagePipe } from 'src/app/shared/pipe/prod-package.pipe';

@Component({
    selector: 'app-first-page',
    templateUrl: './first-page.component.html',
    styleUrls: ['./first-page.component.scss'],
})
export class FirstPageComponent implements OnInit, OnDestroy {
    form = new FormGroup({
        username: new FormControl('', Validators.required),
        full_name: new FormControl('', Validators.required),
        packageID: new FormControl('', Validators.required),
    });

    userErr;
    packages;

    limit = 6;
    page = 1;
    count = 0;

    products = [];

    submitting = false;
    prevUser;

    initPV = 0;

    cartOwner;

    genSub: Subscription;
    cartSub: Subscription;

    pipeSub: Subscription;

    carts = [];

    f(n) {
        return this.form.get(n);
    }

    fetching = false;

    constructor(
        private prodS: ProductService,
        private cartS: CartService,
        private genS: GeneralSettingsService,
        private prodPackPipe: ProdPackagePipe
    ) {}

    ngOnDestroy(): void {
        this.pipeSub?.unsubscribe();
        this.genSub?.unsubscribe();
        this.cartSub?.unsubscribe();
    }

    ngOnInit(): void {
        this.getCartUser();
        this.getPackages();
        this.getInfo();
        this.getCarts();
    }

    private getPackages() {
        this.genSub = this.genS.genSettings.subscribe((res) => {
            this.packages = res?.packages;
        });
    }

    private getCartUser() {
        this.cartOwner = this.cartS.cartOwner;
        if (!this.cartOwner) return;
        if (this.cartOwner.page != 'activate') {
            this.removeUser();
            return;
        }
        this.f('username').setValue(this.cartOwner.username);
        this.f('full_name').setValue(
            `${this.cartOwner.first_name} ${this.cartOwner.last_name}`
        );
        this.f('packageID').setValue(this.cartOwner.selectedPackage);
    }

    removeUser() {
        this.cartOwner = null;
        this.f('full_name').setValue('');
        this.f('packageID').setValue('');
        this.cartS.clearCarts();
    }

    private getCarts() {
        this.cartS.cartItems.subscribe((res) => {
            if (res) {
                this.carts = res;
                this.calcPv();
            }
        });
    }

    calcPv() {
        if (!this.cartOwner?.selectedPackage) return;
        this.pipeSub = this.prodPackPipe
            .transform(this.cartOwner.selectedPackage)
            .subscribe((curPv) => {
                let totalPV = eval(
                    this.carts
                        .map((c) => c.quantity * c.prodInfo.point_value)
                        .join('+')
                );
                let updPack;
                let lastInd = this.packages.length - 1;
                for (let i = lastInd; i > -1; i--) {
                    let p = this.packages[i];
                    if (totalPV >= p.min_pv) {
                        updPack = p;
                        break;
                    }
                }
                if (updPack) {
                    if (+updPack.min_pv >= +curPv) {
                        this.cartS.checkoutStatus.next(true);
                        this.f('packageID').setValue(updPack.id);
                        this.updatePackage(updPack.id);
                        return;
                    }
                }
                this.f('packageID').setValue(this.cartOwner.selectedPackage);
                this.updatePackage(this.cartOwner.selectedPackage);
                this.cartS.checkoutStatus.next(false);
            });
    }

    updatePackage(id) {
        this.cartS.storeUpdatePackage(id);
    }

    trackPackage(i, item) {
        return JSON.stringify(item);
    }

    trackProd(i, item) {
        return JSON.stringify(item);
    }

    verifyUser() {
        if (this.f('username').invalid) return;
        this.userErr = null;
        this.prevUser = this.f('username').value;
        this.fetching = true;
        this.cartS
            .verifyUser(this.f('username').value, this.f('packageID').value, 'activate')
            .subscribe(
                ({ data }) => {
                    this.fetching = false;
                    this.cartOwner = data.user;
                    this.f('full_name').setValue(
                        `${data.user.first_name} ${data.user.last_name}`
                    );
                },
                (err) => {
                    this.fetching = false;
                    this.userErr = err?.error?.error;
                    this.f('full_name').setValue('');
                }
            );
    }

    selectPackage() {
        if (this.f('packageID')?.invalid) return;
        this.cartS.storeSelectPackage(this.f('packageID')?.value);
        this.cartOwner.selectedPackage = this.f('packageID').value;
        this.calcPv();
    }

    private getInfo() {
        this.prodS.getPackageInfo().subscribe(({ data }) => {
            this.products = data.data;
            this.count = data.counts;
        });
    }

    submit() {
        if (this.form.invalid) return;
        this.submitting = true;
        const data = JSON.stringify(this.form.value);
        // this.prodS.activatePackage()
    }
}
