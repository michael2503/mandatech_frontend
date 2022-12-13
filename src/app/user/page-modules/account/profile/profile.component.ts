import { HttpEventType } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LocationsService } from 'src/app/data/localdata/locations.service';
import { AuthService } from 'src/app/data/services/auth.service';
import { FileUploadService } from 'src/app/data/services/file-upload.service';
import { PhoneCodePipe } from 'src/app/shared/pipe/phone-code.pipe';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
    form = new FormGroup({
        first_name: new FormControl('', Validators.required),
        last_name: new FormControl('', Validators.required),
        username: new FormControl('', Validators.required),
        email: new FormControl('', Validators.required),
        phone: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        photo: new FormControl(''),
    });

    countries;

    submitting = false;
    authSub: Subscription;
    auth;
    selectedFile;

    f(n) {
        return this.form.get(n);
    }

    constructor(
        private locS: LocationsService,
        private authS: AuthService,
        private phonePipe: PhoneCodePipe,
        private fileUpS: FileUploadService
    ) {}

    ngOnDestroy(): void {
        this.authSub?.unsubscribe();
    }

    ngOnInit(): void {
        this.f('email').disable();
        this.countries = this.locS.countriesAndStates;
        this.getAuth();
    }

    onSelect(e) {
        this.selectedFile = e.target.files[0];
        this.f('photo').setValue(URL.createObjectURL(this.selectedFile));
    }

    private getAuth() {
        this.authSub = this.authS.user.subscribe((auth) => {
            this.auth = auth;
            let phoneCode = this.phonePipe.transform(auth.country);
            for (let key in this.form.value) {
                this.f(key).setValue(
                    auth[key]?.replace(new RegExp(`^\\${phoneCode}`), '') || ''
                );
            }
        });
    }

    submit() {
        if (this.form.invalid) return;
        this.submitting = true;
        if (!this.selectedFile) {
            this.finalSubmit();
            return;
        }
        const fd = new FormData();
        fd.append('file', this.selectedFile, this.selectedFile.name);
        this.fileUpS
            .upload(fd, 'photo', this.selectedFile.name.replace(/\..+$/, ''))
            .subscribe((ev) => {
                if (ev.type == HttpEventType.Response) {
                    this.f('photo').setValue(ev.body.secure_url);
                    this.finalSubmit();
                }
            });
    }

    finalSubmit() {
        let data = JSON.stringify(this.form.value);
        let chng = JSON.parse(data);
        let phoneC = this.phonePipe.transform(chng.country);
        chng.phone = `${phoneC}${chng.phone}`;
        data = JSON.stringify(chng);
        this.authS.updateProfile(data).subscribe(
            (res) => {
                this.submitting = false;
            },
            (err) => {
                this.submitting = false;
            }
        );
    }
}
