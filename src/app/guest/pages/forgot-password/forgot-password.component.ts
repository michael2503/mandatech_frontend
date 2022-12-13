import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/data/services/auth.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { StorageService } from 'src/app/data/services/storage.service';
import { NgwWowService } from 'ngx-wow';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

    thePage = 'firstForm';

    theMessage: any;
    showNotice = false;
    deleteModal = false;
    justMssg = false;

    submittingOne = false;
    submittingTwo = false;
    submittingThree = false;

    form = new FormGroup({
        email: new FormControl('', Validators.required),
    });

    formTwo = new FormGroup({
        code: new FormControl('', Validators.required),
        email: new FormControl('', Validators.required),
    });

    formThree = new FormGroup({
        password: new FormControl('', Validators.required),
        retype_password: new FormControl('', Validators.required),
        email: new FormControl('', Validators.required),
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

    ft(nt) {
        return this.formTwo.get(nt);
    }

    ftr(ntr) {
        return this.formThree.get(ntr);
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
      const authSub = this.authS.user.subscribe(auth => {
        this.auth = auth;
      })
      authSub.unsubscribe();
    }

    submit() {
        if (this.form.invalid) return;
        this.submittingOne = true;
        this.userErr = null;
        this.passErr = null;
        const data = JSON.stringify(this.form.value);
        this.authS.forgotPassword(data).subscribe( res => {
            this.thePage = 'secondForm';
            this.formTwo.get('email').setValue(res.data);
            this.submittingOne = false;
        }, err => {
            if (err.error.error) {
              this.userErr = err.error.error;
            }
            this.submittingOne = false;
        });
    }

    submitTwo(){
        if (this.formTwo.invalid) return;
        this.submittingTwo = true;
        const data = JSON.stringify(this.formTwo.value);
        this.authS.verifyPassCode(data).subscribe( res => {
            this.formThree.get('email').setValue(res.data);
            this.thePage = 'thirdForm';
            this.submittingTwo = false;
        }, err => {
            if (err.error.error) {
              this.userErr = err.error.error;
            }
            this.submittingTwo = false;
        });
    }


    submitThree(){
        if (this.formThree.invalid) return;
        const password1 = this.formThree.get('password').value;
        const password2 = this.formThree.get('retype_password').value;
        if(password1 != password2){
            this.userErr = "Opps! password not matched";
            return;
        }
        this.submittingThree = true;
        const data = JSON.stringify(this.formThree.value);
        this.authS.resetPassword(data).subscribe( res => {
            console.log(res)
            this.theMessage = "Your password recovery process was a success. You can now login with your new password.";
            this.formThree.reset();
            this.showNotice = true;
            this.deleteModal = false;
            this.justMssg = true;
            this.removeNotice();
            this.submittingThree = false;
            this.userErr = '';
        }, err => {
            if (err.error.error) {
              this.userErr = err.error.error;
            }
            this.submittingThree = false;
        });
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

    removeNotice() {
        setTimeout(() => {
          if (this.showNotice = true) {
            this.showNotice = false;
          }
        }, 4000);
    }

    closeMyNotice() {
        this.showNotice = false;
    }


}
