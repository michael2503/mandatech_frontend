import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/data/services/auth.service';
import { ConfigService } from 'src/app/data/services/config.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { CartService } from 'src/app/data/services/guest/cart.service';
import { WalletService } from 'src/app/data/services/user/wallet.service';

@Component({
    selector: 'app-order-summary',
    templateUrl: './order-summary.component.html',
    styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
    carts = [];
    balance = 0;

    auth;

    form = new FormGroup({
        payMethod: new FormControl('', Validators.required),
        pop: new FormControl(''),
        ref_no: new FormControl(''),
        username: new FormControl('', Validators.required),
        cartIDs: new FormControl('', Validators.required),
        packageID: new FormControl('', Validators.required),
    });

    paystackKey;
    currCode;

    genSub: Subscription;
    cartSub: Subscription;

    get paystackAmnt() {
        return Math.round(this.totalAmnt * 100);
    }

    paystackRef;

    submitting = false;

    get totalAmnt() {
        return eval(
            this.carts.map((c) => c.quantity * c.prodInfo.sales_price).join('+')
        );
    }

    f(n) {
        return this.form.get(n);
    }

    get validForm() {
        return this.f('payMethod').value == 'wallet'
            ? this.balance >= this.totalAmnt
            : this.form.valid;
    }

    constructor(
        private cartS: CartService,
        private walletS: WalletService,
        private genS: GeneralSettingsService,
        private router: Router,
        private authS: AuthService,
        private configS: ConfigService
    ) {}

    ngOnDestroy(): void {
        this.genSub?.unsubscribe();
        this.cartSub?.unsubscribe();
        localStorage.removeItem('checkoutData');
    }

    ngOnInit(): void {
        this.getAuth();
        this.getSettings();
        this.getCarts();
        this.getCheckoutData();
        this.getBalance();
    }

    private getAuth() {
        const authSub = this.authS.user.subscribe((auth) => {
            this.auth = auth;
        });
        authSub.unsubscribe();
    }

    private getCheckoutData() {
        const data = JSON.parse(localStorage.getItem('checkoutData'));
        for (let key in this.form.value) {
            this.f(key).setValue(data[key] || '');
        }
        this.f('cartIDs').setValue(this.carts.map(c => c.id).join(','));
    }

    private getSettings() {
        this.genSub = this.genS.genSettings.subscribe((res) => {
            this.paystackKey = res?.payStackKey;
            this.currCode = res?.currency?.code;
            this.paystackRef = this.configS.randStr(10);
        });
    }

    private getBalance() {
        this.walletS.getBalance().subscribe((res) => {
            this.balance = res.data.available;
        });
    }

    trackCart(i, item) {
        return JSON.stringify(item);
    }

    private getCarts() {
        this.cartSub = this.cartS.cartItems.subscribe((res) => {
            if (res) {
                this.carts = res;
            }
        });
    }

    paymentDone(e) {
        this.f('ref_no').setValue(e.reference);
        this.submit();
    }

    paymentCancel() {
        this.submitting = false;
    }

    payMChng() {
        if (this.f('payMethod').value == 'bank') {
            this.f('pop').setValidators(Validators.required);
        } else {
            this.f('pop').setValidators(null);
        }
        this.f('pop').updateValueAndValidity();
    }

    firstSubmit() {
        // console.log(this.validForm, this.form.value);
        if (!this.validForm) return;
        this.submitting = true;
        if (this.f('payMethod').value == 'paystack') return;
        this.submit();
    }


    submit() {
        const data = JSON.stringify(this.form.value);
        this.cartS.checkout(data).subscribe(
            (res) => {
                this.submitting = false;
                this.router.navigateByUrl('/user/business/activate-package');
            },
            (err) => {
                this.submitting = false;
            }
        );
    }
}
