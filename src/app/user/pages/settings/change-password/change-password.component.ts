import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserSettingsService } from 'src/app/data/services/user/user-settings.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
    isSubmitting = false;

    theMessage: any;
    showNotice = false;
    deleteModal = false;
    justMssg = false;

    form = new FormGroup({
        old_password: new FormControl('', [ Validators.required ]),
        new_password: new FormControl('', [ Validators.required ]),
        retype_new_password: new FormControl('', [ Validators.required ]),
    });

    f(n){
        return this.form.get(n)
    }

    constructor(
        private userSettingsService: UserSettingsService
    ) { }

    ngOnInit(): void {
    }

    submit(){
        if(this.form.invalid) return;
        const pFirst = this.form.get('new_password').value;
        const pSecond = this.form.get('retype_new_password').value;
        if(pFirst !== pSecond){
            this.theMessage = "New password not matched with retyped password";
            this.showNotice = true;
            this.justMssg = false;
            this.deleteModal = true;
            this.removeNotice();
            return;
        }


        this.isSubmitting = true;
        const data = JSON.stringify(this.form.value);
        this.userSettingsService.changePassword(data).subscribe(res => {
            console.log(res)
            if(res){
                this.form.reset();
                this.theMessage = "Password successfully changed.";
                this.showNotice = true;
                this.justMssg = true;
                this.deleteModal = false;
                this.removeNotice();
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
