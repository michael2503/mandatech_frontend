import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { WalletService } from 'src/app/data/services/user/wallet.service';

@Component({
    selector: 'app-transfer',
    templateUrl: './transfer.component.html',
    styleUrls: ['./transfer.component.scss'],
})
export class TransferComponent implements OnInit {
    form = new FormGroup({
        username: new FormControl('', Validators.required),
        amount: new FormControl('', Validators.required),
    });

    submitting = false;
    balance = 0;

    curr;

    f(n) {
        return this.form.get(n);
    }

    userErr;
    prevUser;

    constructor(
        private walletS: WalletService,
        private genS: GeneralSettingsService
    ) {}

    ngOnInit(): void {
        this.getCurrency();
        this.getBalance();
    }

    private getCurrency() {
        this.genS.genSettings.subscribe((res) => {
            this.curr = res?.currency?.symbol;
        });
    }

    private getBalance() {
        this.walletS.getBalance().subscribe((res) => {
            this.balance = res.data.available;
        });
    }

    submit() {
        if (this.form.invalid || +this.f('amount')?.value > this.balance) return;
        this.submitting = true;
        this.prevUser = this.f('username').value;
        this.userErr = null;
        const data = JSON.stringify(this.form.value);
        this.walletS.transferFund(data).subscribe(
            (res) => {
                this.submitting = false;
                this.balance -= +this.f('amount').value;
                this.form.reset();
            },
            (err) => {
                this.submitting = false;
                this.userErr = err?.error?.error;
            }
        );
    }
}
