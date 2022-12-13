import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/data/services/auth.service';
import { ConfigService } from 'src/app/data/services/config.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { WalletService } from 'src/app/data/services/user/wallet.service';

@Component({
    selector: 'app-transaction-wallet',
    templateUrl: './transaction-wallet.component.html',
    styleUrls: ['./transaction-wallet.component.scss'],
})
export class TransactionWalletComponent implements OnInit {
    submitting = false;
    form = new FormGroup({
        amount: new FormControl('', Validators.required),
        payment_method: new FormControl('', Validators.required),
        pop: new FormControl(''),
        ref_no: new FormControl(''),
    });

    f(n) {
        return this.form.get(n);
    }

    curr;

    transInfo = {
        totalDeposit: 0,
        totalSpend: 0,
        available: 0,
    };

    closeModal = new BehaviorSubject(false);

    transactionHist = [];
    count = 0;
    limit = 10;
    page = 1;

    auth;

    currCode;
    paystackKey;
    paystackRef;

    get paystackAmnt() {
        return Math.round(+this.f('amount').value * 100);
    }

    get begin() {
        return (this.page - 1) * this.limit + 1;
    }

    get end() {
        return this.begin + this.transactionHist.length - 1;
    }

    constructor(
        private walletS: WalletService,
        private genS: GeneralSettingsService,
        private authS: AuthService,
        private configS: ConfigService,
    ) {}

    ngOnInit(): void {
        this.getAuth();
        this.getCurrency();
        this.getTransInfo();
    }

    private getAuth() {
        this.authS.user.subscribe((auth) => {
            this.auth = auth;
        });
    }

    private getTransInfo() {
        this.walletS.getBalance().subscribe((res) => {
            this.transInfo = res.data;
            this.transactionHist = res.data.transHistory.data;
            this.count = res.data.transHistory.counts;
        });
    }

    payMChng() {
        this.paystackRef = this.configS.randStr(10);
        if (this.f('payment_method').value == 'bank') {
            this.f('pop').setValidators(Validators.required);
        } else {
            this.f('pop').setValidators(null);
        }
        this.f('pop').updateValueAndValidity();
    }

    private getCurrency() {
        this.genS.genSettings.subscribe((res) => {
            this.curr = res?.currency?.symbol;
            this.currCode = res?.currency?.code;
            this.paystackKey = res?.payStackKey;
        });
    }

    onClose() {
        this.form.reset();
        this.f('payment_method').setValue('');
    }

    morePage(page) {
        if (
            (this.end == this.count && page > 0) ||
            (this.page == 1 && page < 0)
        )
            return;
        this.page += page;
        this.getHistory();
    }

    getHistory() {
        this.walletS.getTransHist(this.limit, this.page).subscribe((res) => {
            this.transactionHist = res.data.data;
            this.count = res.data.counts;
        });
    }

    paymentDone(e) {
        this.f('ref_no').setValue(e.reference);
        this.submit();
    }

    paymentCancel() {
        this.submitting = false;
    }

    firstSubmit() {
        if (this.form.invalid) return;
        this.submitting = true;
        if (this.f('payment_method').value == 'paystack') return;
        this.submit();
    }

    submit() {
        if (this.form.invalid) return;
        this.submitting = true;
        const data = JSON.stringify(this.form.value);
        this.walletS.fundWallet(data).subscribe((res) => {
            this.submitting = false;
            this.transactionHist.unshift(res.data);
            this.count++;
            if (this.f('payment_method').value != 'bank') {
                this.transInfo.totalDeposit += res.data.amount;
                this.transInfo.available = this.transInfo.totalDeposit - this.transInfo.totalSpend;
            }
            this.closeModal.next(true);
            this.onClose();
        }, err => {
            this.submitting = false;
        });
    }
}
