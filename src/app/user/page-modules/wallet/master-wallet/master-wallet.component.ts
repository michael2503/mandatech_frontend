import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { WalletService } from 'src/app/data/services/user/wallet.service';

@Component({
    selector: 'app-master-wallet',
    templateUrl: './master-wallet.component.html',
    styleUrls: ['./master-wallet.component.scss'],
})
export class MasterWalletComponent implements OnInit {
    activeTab = 'transaction';
    curr;

    form = new FormGroup({
        amount: new FormControl('', Validators.required),
    });

    get amount() {
        return this.form.get('amount');
    }

    get vat() {
        return (7 / 100) * +this.amount.value;
    }

    closeModal = new BehaviorSubject(false);

    walletInfo = {
        totalEarnings: 0,
        withdrawn: 0,
        available: 0,
    };

    transactionHist = [];
    withdrawalHist = [];
    transactionCount = 0;
    withdrawalCount = 0;

    count = 0;
    limit = 10;
    page = 1;

    submitting = false;

    get begin() {
        return (this.page - 1) * this.limit + 1;
    }

    get end() {
        return this.begin + this[`${this.activeTab}Hist`].length - 1;
    }

    constructor(
        private walletS: WalletService,
        private genS: GeneralSettingsService
    ) {}

    ngOnInit(): void {
        this.getCurrency();
        this.getWalletInfo();
    }

    private getCurrency() {
        this.genS.genSettings.subscribe((res) => {
            this.curr = res?.currency?.symbol;
        });
    }

    private getWalletInfo() {
        this.walletS.getMasterWallet().subscribe((res) => {
            this.walletInfo = res.data;
            this.transactionHist = res.data.walletHistory.data;
            this.withdrawalHist = res.data.withdrawalHist.data;
            this.transactionCount = res.data.walletHistory.counts;
            this.withdrawalCount = res.data.withdrawalHist.counts;
            this.count = res.data.walletHistory.counts;
        });
    }

    switchTab(tab) {
        this.activeTab = tab;
        this.page = 1;
        this.count = this[`${tab}Count`];
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
        let path = `${this.activeTab == 'transaction' ? 'wallet/' : ''}${
            this.activeTab
        }`;
        this.walletS
            .getHistory(path, this.limit, this.page)
            .subscribe((res) => {
                this[`${this.activeTab}Hist`] = res.data.data;
                this.count = res.data.counts;
            });
    }

    submit() {
        if (this.form.invalid || +this.amount.value > this.walletInfo.available)
            return;
        this.submitting = true;
        const data = JSON.stringify(this.form.value);
        this.walletS.withdraw(data).subscribe(
            (res) => {
                this.submitting = false;
                this.withdrawalHist.unshift(res.data);
                this.walletInfo.available -= res.data.amount;
                this.walletInfo.withdrawn += res.data.amount;
                this.closeModal.next(true);
                this.form.reset();
            },
            (err) => {
                this.submitting = false;
            }
        );
    }
}
