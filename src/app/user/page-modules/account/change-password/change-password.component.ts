import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/data/services/auth.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
    form = new FormGroup({
        old_password: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        confirm_password: new FormControl('', Validators.required),
    });

    f(n) {
        return this.form.get(n);
    }

    submitting = false;

    get validForm() {
        return (
            this.form.valid &&
            this.f('password').value == this.f('confirm_password').value
        );
    }

    constructor(private authS: AuthService) {}

    ngOnInit(): void {}

    submit() {
        if (!this.validForm) return;
        this.submitting = true;
        const data = JSON.stringify(this.form.value);
        this.authS.changePass(data).subscribe(
            (res) => {
                this.submitting = false;
                this.authS.logout();
            },
            (err) => {
                this.submitting = false;
            }
        );
    }
}
