import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { WalletService } from 'src/app/data/services/user/wallet.service';

@Component({
    selector: 'app-voucher',
    templateUrl: './voucher.component.html',
    styleUrls: ['./voucher.component.scss'],
})
export class VoucherComponent implements OnInit {
    closeModal = new BehaviorSubject(false);
    form = new FormGroup({
        category: new FormControl('Registration', Validators.required),
        amount: new FormControl('', Validators.required),
    });

    submitting = false;

    vouchInfo = {
        totalVoucher: 0,
        usedVoucher: 0,
        availVoucher: 0,
    };

    f(n) {
        return this.form.get(n);
    }

    limit = 10;
    page = 1;
    count = 0;
    vouchers = [];

    balance = 0;

    get begin() {
        return (this.page - 1) * this.limit + 1;
    }

    get end() {
        return this.begin + this.vouchers.length - 1;
    }

    curr;

    regFee = 0;

    constructor(
        private walletS: WalletService,
        private genS: GeneralSettingsService
    ) {}

    ngOnInit(): void {
        this.getSettings();
        this.getVouchInfo();
    }

    private getVouchInfo() {
        this.walletS.voucherInfo().subscribe((res) => {
            this.vouchInfo = res.data;
            this.balance = res.data.available;
            this.vouchers = res.data.allVoucher.data;
            this.count = res.data.allVoucher.counts;
        });
    }

    private getSettings() {
        this.genS.genSettings.subscribe((res) => {
            this.curr = res?.currency?.symbol;
            this.regFee = res?.configuration?.activation_fee;
            this.f('amount').setValue(this.regFee);
        });
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
        this.walletS.getVouchers(this.limit, this.page).subscribe((res) => {
            this.vouchers = res.data.data;
            this.count = res.data.counts;
        });
    }

    onClose() {
        this.form.reset();
        this.f('category').setValue('Registration');
        this.f('amount').setValue(this.regFee);
    }

    submit() {
        if (this.form.invalid || this.balance < this.regFee) return;
        this.submitting = true;
        const data = JSON.stringify(this.form.value);
        this.walletS.generateVouch(data).subscribe(
            (res) => {
                this.submitting = false;
                this.vouchers.unshift(res.data);
                this.balance -= res.data.amount;
                this.vouchInfo.totalVoucher++;
                this.vouchInfo.availVoucher++;
                this.closeModal.next(true);
            },
            (err) => {
                this.submitting = false;
            }
        );
    }
}
