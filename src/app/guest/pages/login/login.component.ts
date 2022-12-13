import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/data/services/auth.service';
import { CartService } from 'src/app/data/services/guest/cart.service';
import { NgwWowService } from 'ngx-wow';
import { StorageService } from 'src/app/data/services/storage.service';
import { Router } from '@angular/router';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  submitting = false;
  form = new FormGroup({
    user: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    products: new FormControl(''),
  });

  webSet;

  userErr;
  passErr;
  prevUser;
  prevPass;

  auth;

  f(n) {
    return this.form.get(n);
  }

  constructor(
    private authS: AuthService,
    private wowService: NgwWowService,
    private storageService: StorageService,
    private router: Router,
    private generalSettingService: GeneralSettingsService,
) { this.wowService.init(); }

  ngOnInit(): void {
    this.getAuth();
    this.genSetting();
  }

  private getAuth() {
    this.authS.user.subscribe(auth => {
      this.auth = auth;
    })
    if(this.auth){
        this.router.navigateByUrl('/user/dashboard');
    } else {
        this.router.navigateByUrl('/login');
    }
  }

  carts;
  cartPids='';
  async submit() {
    if (this.form.invalid) return;
    this.submitting = true;
    this.userErr = null;
    this.passErr = null;
    this.prevPass = this.f('password').value;
    this.prevUser = this.f('user').value;

    const cartListing =  await this.storageService.getString('storeCarts');
    this.carts = JSON.parse(cartListing);

    if(this.carts){
        for (let i = 0; i < this.carts.length; i++) {
            this.cartPids += this.carts[i].id + ':' + this.carts[i].qty + ',';
        }
    }
    this.form.get('products').setValue(this.cartPids.slice(0, -1));

    console.log(this.form.value)

    const data = JSON.stringify(this.form.value);

    this.authS.login(data).subscribe(
      (res) => {
        this.submitting = false;

        this.theRoute();
      },
      (err) => {
        this.submitting = false;
        const error = err?.error?.error;
        if (error) {
          if (error.match(/password/i)) {
            this.passErr = error;
          } else {
            this.userErr = error;
          }
        }
      }
    );
  }


    private genSetting(){
        this.generalSettingService.genSettings.subscribe(res => {
            if(res){
                this.webSet = res.websiteSettings;
            }
        })
    }


    async theRoute() {
        const toWhere =  await this.storageService.getString('comingFrom');
        if(toWhere){
            this.router.navigateByUrl('/user/checkout');
        } else {
            this.router.navigateByUrl('/user/dashboard');
        }
    }

}
