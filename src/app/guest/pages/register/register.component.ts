import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocationsService } from 'src/app/data/localdata/locations.service';
import { AuthService } from 'src/app/data/services/auth.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { CartService } from 'src/app/data/services/guest/cart.service';
import { StorageService } from 'src/app/data/services/storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  submitting = false;

  form = new FormGroup({
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    products: new FormControl(''),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^[a-z\d.!#$%&’*+/=?^_`{|}~-]+@[a-z\d-]+(?:\.[a-z\d-]+)*$/i
      ),
    ]),
    password: new FormControl('', Validators.required),
    confirm_password: new FormControl('', Validators.required),
  });

  @ViewChild('refGroup') refGroup: ElementRef;
  @ViewChild('userGroup') userGroup: ElementRef;

  prevUsername;
  usernameErr;
  referralErr;
  prevReferral;

  f(n) {
    return this.form.get(n);
  }

  countries;
  auth;

  webSet;

  get passMismatch() {
    return this.f('password').value != this.f('confirm_password').value;
  }

  constructor(
    private authS: AuthService,
    private locS: LocationsService,
    private generalSettingService: GeneralSettingsService,
    private router: Router,
    private storageService: StorageService,
  ) {}

  ngOnInit(): void {
    this.getAuth();
    this.countries = this.locS.countriesAndStates;
    this.genSetting();
  }

    private getAuth() {
        this.authS.user.subscribe(auth => {
            this.auth = auth;
            if(this.auth.id){
                this.router.navigateByUrl('/user/dashboard');
            } else {
                this.router.navigateByUrl('/login');
            }
        })
    }

//   submit() {
//     if (this.form.invalid || this.passMismatch) return;
//     this.usernameErr = null;
//     this.referralErr = null;
//     this.prevUsername = this.f('username').value;
//     this.prevReferral = this.f('referral').value;
//     this.submitting = true;
//     const data = JSON.stringify(this.form.value);
//     let carts = 'none';
//     if (!this.auth) {
//       let cartItems = this.cartS.cartItems.value;
//       if (cartItems.length) {
//         carts = cartItems.map((c) => `${c.pid}-${c.quantity}`).join(',');
//       }
//     }
//     this.authS.register(data, carts).subscribe(
//       (res) => {
//         this.submitting = false;
//         this.cartS.cartItems.next(res.data.carts);
//         localStorage.removeItem('cartItems');
//       },
//       (err) => {
//         this.submitting = false;
//         let error = err?.error?.error;
//         if (error) {
//           if (error.match(/username/i)) {
//             this.usernameErr = error;
//             this.scrollToView(this.userGroup.nativeElement);
//           } else {
//             this.referralErr = error;
//             this.scrollToView(this.refGroup.nativeElement);
//           }
//         }
//       }
//     );
//   }




    carts;
    cartPids='';

    userErr;
    passErr;

    async submit() {
        if (this.form.invalid) return;
        this.submitting = true;
        this.userErr = null;
        this.passErr = null;

        const pass = this.form.get('password').value;
        const compass = this.form.get('confirm_password').value;

        if(compass != pass){
            this.passErr = "Password not matched";
            this.submitting = true;
            return;
        }

        const cartListing =  await this.storageService.getString('storeCarts');
        this.carts = JSON.parse(cartListing);

        if(this.carts){
            for (let i = 0; i < this.carts.length; i++) {
                this.cartPids += this.carts[i].id + ':' + this.carts[i].qty + ',';
            }
        }
        this.form.get('products').setValue(this.cartPids.slice(0, -1));

        const data = JSON.stringify(this.form.value);

        this.authS.register(data).subscribe(
            (res) => {
                this.submitting = false;
                this.theRoute();
            },
            (err) => {
                this.submitting = false;
                const error = err?.error?.error;
                console.log(error)
                if (error) {
                    this.userErr = error;
                }
            }
        );
    }

  scrollToView(el) {
    document.scrollingElement.scrollTop = el.offsetTop - 95;
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
