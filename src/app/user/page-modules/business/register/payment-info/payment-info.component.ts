import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReferralService } from 'src/app/data/services/user/referral.service';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent implements OnInit {
  form = new FormGroup({
    user_id: new FormControl(''),
    id: new FormControl(''),
    account_name: new FormControl('', Validators.required),
    account_number: new FormControl('', Validators.required),
    bank: new FormControl('', Validators.required),
  });

  f(n) {
    return this.form.get(n);
  }

  submitting = false;
  user;

  constructor(
    private router: Router,
    private refS: ReferralService,
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.getBank();
  }

  private getUser() {
    const user = this.refS.currentSignupUser;
    this.f('user_id').setValue(user.id);
  }

  back() {
    history.back();
  }

  private getBank() {
   const ubank = this.refS.userBank;
   if (ubank) {
     for (let key in this.form.value) {
       if (key == 'user_id') continue;
       this.f(key).setValue(ubank[key]);
     }
   }
  }

  submit() {
    if (this.form.invalid) return;
    this.submitting = true;
    const data = JSON.stringify(this.form.value);
    this.refS.updateBank(data).subscribe(res => {
      this.submitting = false;
      this.router.navigateByUrl('/user/business/register/confirm-details');
    }, err => {
      this.submitting = false;
    })
  }

}
