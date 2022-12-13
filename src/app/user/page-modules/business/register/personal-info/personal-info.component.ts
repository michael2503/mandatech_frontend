import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'src/app/data/class/custom-validators';
import { ReferralService } from 'src/app/data/services/user/referral.service';
import { PhoneCodePipe } from 'src/app/shared/pipe/phone-code.pipe';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit {
  form = new FormGroup({
    id: new FormControl(''),
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^[a-z\d.!#$%&’*+/=?^_`{|}~-]+@[a-z\d-]+(?:\.[a-z\d-]+)*$/i
      ),
    ]),
    phone: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    dob: new FormControl('', [
      Validators.required,
      CustomValidators.futureDateCheck,
    ]),
    gender: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirm_password: new FormControl('', Validators.required),
  });

  user;

  submitting = false;

  f(n) {
    return this.form.get(n);
  }

  ctryCode;

  fromEdit = false;

  get passMismatch() {
    return this.f('password').value != this.f('confirm_password').value;
  }

  constructor(
    private refS: ReferralService,
    private phoneCode: PhoneCodePipe,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.fromEdit = this.router.url.split('/').slice(-1)[0] == 'edit';
    this.getUser();
  }

  private getUser() {
    this.user = this.refS.currentSignupUser;
    if (this.user) {
      this.f('id').setValue(this.user.id);
      this.ctryCode = this.phoneCode.transform(this.user.country);
      for (let key in this.form.value) {
        if (key == 'password') break;
        this.f(key).setValue(
          this.user[key] && `${this.user[key]}`.replace(
            new RegExp(`^${this.ctryCode.replace('+', '\\+')}`),
            ''
          ) || ''
        );
      }
    }
  }

  submit() {
    if (this.form.invalid || this.passMismatch) return;
    let data = JSON.stringify(this.form.value);
    let fVal = JSON.parse(data);
    fVal.phone = `${this.ctryCode}${fVal.phone}`;
    data = JSON.stringify(fVal);
    this.submitting = true;
    this.refS.updateProfile(data).subscribe(
      (res) => {
        this.submitting = false;
        if (this.fromEdit) {
          this.router.navigateByUrl('/user/business/register/confirm-details');
          return;
        }
        this.router.navigateByUrl('/user/business/register/payment-info');
      },
      (err) => {
        this.submitting = false;
      }
    );
  }
}
