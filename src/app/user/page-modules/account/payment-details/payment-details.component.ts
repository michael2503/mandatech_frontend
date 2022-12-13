import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { BankService } from 'src/app/data/services/user/bank.service';

@Component({
    selector: 'app-payment-details',
    templateUrl: './payment-details.component.html',
    styleUrls: ['./payment-details.component.scss'],
})
export class PaymentDetailsComponent implements OnInit {
    form = new FormGroup({
        account_name: new FormControl('', Validators.required),
        account_number: new FormControl('', Validators.required),
        bank: new FormControl('', Validators.required),
        id: new FormControl(''),
    });
    submitting = false;
    closeModal = new BehaviorSubject(false);

    f(n) {
        return this.form.get(n);
    }

    banks;

    constructor(private bankS: BankService) {}

    ngOnInit(): void {
        this.getBankInfo();
    }

    private getBankInfo() {
        this.bankS.getBanks().subscribe((res) => {
            this.banks = res.data;
        });
    }

    setEdit(bank) {
        for (let key in this.form.value) {
            this.f(key).setValue(bank[key]);
        }
    }

    submit() {
        if (this.form.invalid) return;
        this.submitting = false;
        const data = JSON.stringify(this.form.value);
        this.bankS.updateBank(data).subscribe(
            (res) => {
                this.submitting = false;
            },
            (err) => {
                this.submitting = false;
            }
        );
    }
}
