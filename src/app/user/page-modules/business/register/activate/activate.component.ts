import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/data/services/auth.service';
import { ConfigService } from 'src/app/data/services/config.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { ReferralService } from 'src/app/data/services/user/referral.service';
import { WalletService } from 'src/app/data/services/user/wallet.service';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent implements OnInit {
  submitting = false;

  form = new FormGroup({
    user_id: new FormControl(''),
    payment_method: new FormControl('', Validators.required),
    ref_no: new FormControl(''),
    voucher_code: new FormControl(''),
    pop: new FormControl(''),
  });

  balance = 0;
  // voucher, paystack, wallet
  prevVoucher;
  voucherErr;

  regFee = 0;

  auth;

  f(n) {
    return this.form.get(n);
  }

  currCode;
  currSym;

  paystackKey;
  paystackAmnt;
  paystackRef;

  constructor(
    private genS: GeneralSettingsService,
    private refS: ReferralService,
    private walletS: WalletService,
    private router: Router,
    private configS: ConfigService,
  ) {}

  ngOnInit(): void {
    this.getBalance();
    this.getFee();
    this.getAuth();
    this.genPaystackRef();
  }

  private genPaystackRef() {
    this.paystackRef = this.configS.randStr(10);
  }

  private getAuth() {
      this.auth = this.refS.currentSignupUser;
      this.f('user_id').setValue(this.auth.id);
  }

  get validForm() {
    if (this.f('payment_method').value != 'wallet') return this.form.valid;
    return this.balance >= this.regFee;
  }

  private getFee() {
    this.genS.genSettings.subscribe(res => {
      this.regFee = res?.configuration?.activation_fee;

      this.paystackKey = res?.payStackKey;
      this.currCode = res?.currency?.code;
      this.currSym = res?.currency?.symbol;
      this.paystackAmnt = Math.round(this.regFee * 100);
    });
  }

  private getBalance() {
    this.walletS.getBalance().subscribe((res) => {
      this.balance = res.data.available;
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
    if (this.f('payment_method').value == 'voucher') {
      this.f('voucher_code').setValidators(Validators.required);
    } else {
      this.f('voucher_code').setValidators(Validators.nullValidator);
    }
    this.f('voucher_code').updateValueAndValidity();
  }

  firstSubmit() {
    if (!this.validForm) return;
    this.submitting = true;
    if (this.f('payment_method').value == 'paystack') return;
    this.submit();
  }

  back() {
    history.back();
  }

  submit() {
    this.voucherErr = null;
    this.prevVoucher = this.f('voucher_code').value;
    const data = JSON.stringify(this.form.value);
    this.refS.activateUser(data).subscribe(
      (res) => {
        this.submitting = false;
        this.refS.removeUser();
        this.router.navigateByUrl('/user/business/register');
      },
      (err) => {
        this.submitting = false;
        this.voucherErr = err?.error?.error;
      }
    );
  }
}
