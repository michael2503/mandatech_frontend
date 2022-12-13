import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/data/services/auth.service';
import { UserSettingsService } from 'src/app/data/services/user/user-settings.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    isSubmitting = false;

    theMessage: any;
    showNotice = false;
    deleteModal = false;
    justMssg = false;

    form = new FormGroup({
        first_name: new FormControl('', [ Validators.required ]),
        last_name: new FormControl('', [ Validators.required ]),
        email: new FormControl('', [ Validators.required ]),
        phone: new FormControl('', [ Validators.required ]),
    });

    f(n){
        return this.form.get(n)
    }

    user;

    constructor(
        private userSettingsService: UserSettingsService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.getProfile()
    }


    private getProfile(){
        this.authService.user.subscribe(res => {
            console.log(res)
            if(res){
                this.user = res;
                this.form.get('first_name').setValue(this.user.first_name);
                this.form.get('last_name').setValue(this.user.last_name);
                this.form.get('email').setValue(this.user.email);
                this.form.get('phone').setValue(this.user.phone);
            }
        })
    }

    submit(){
        if(this.form.invalid) return;

        this.isSubmitting = true;
        const data = JSON.stringify(this.form.value);
        this.authService.updateProfile(data).subscribe(res => {
            console.log(res)
            if(res){
                this.form.reset();
                this.theMessage = "Profile successfully updated.";
                this.showNotice = true;
                this.justMssg = true;
                this.deleteModal = false;
                this.removeNotice();
                this.getProfile();
            }
            this.isSubmitting = false;
        }, (err) => {
            this.isSubmitting = false;
            let error = err?.error?.error;
            if (error) {
                this.theMessage = error;
                this.showNotice = true;
                this.justMssg = false;
                this.deleteModal = true;
                this.removeNotice();
            }
        })
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
