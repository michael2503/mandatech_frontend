import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationsService } from 'src/app/data/localdata/locations.service';
import { ReferralService } from 'src/app/data/services/user/referral.service';

@Component({
    selector: 'app-placement',
    templateUrl: './placement.component.html',
    styleUrls: ['./placement.component.scss'],
})
export class PlacementComponent implements OnInit {
    submitting = false;

    @ViewChild('userG') userG: ElementRef;
    @ViewChild('sponsG') sponsG: ElementRef;
    @ViewChild('placG') placG: ElementRef;

    form = new FormGroup({
        username: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        referral: new FormControl('', Validators.required),
        placement: new FormControl('', Validators.required),
        first_member: new FormControl('', Validators.required),
        sponsor_side: new FormControl('', Validators.required),
    });

    prevRef;
    prevPlac;

    refErr;
    placErr;

    countries;

    prevUser;
    userErr;

    hasPlacement;

    f(n) {
        return this.form.get(n);
    }

    constructor(
        private locS: LocationsService,
        private refS: ReferralService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.countries = this.locS.countriesAndStates;
        this.route.queryParams.subscribe((param) => {
            this.f('placement').setValue(param['placement']);
            this.hasPlacement = param['placement'];
        });
    }

    submit() {
        if (this.form.invalid) return;
        this.submitting = true;
        this.prevRef = this.f('referral').value;
        this.prevPlac = this.f('placement').value;
        this.prevUser = this.f('username').value;
        this.userErr = null;
        this.refErr = null;
        this.placErr = null;
        const data = JSON.stringify(this.form.value);
        this.refS.signupUser(data).subscribe(
            (res) => {
                this.submitting = false;
                this.router.navigateByUrl(
                    '/user/business/register/personal-info'
                );
            },
            (err) => {
                this.submitting = false;
                let error = err?.error?.error;
                if (error) {
                    let [msg, owner] = error.split('|').map((e) => e.trim());
                    if (owner == 1) {
                        this.userErr = msg;
                        this.scrollToView(this.userG.nativeElement);
                    } else if (owner == 2) {
                        this.refErr = msg;
                        this.scrollToView(this.sponsG.nativeElement);
                    } else {
                        this.placErr = msg;
                        this.scrollToView(this.placG.nativeElement);
                    }
                }
            }
        );
    }

    scrollToView(el) {
        document.scrollingElement.scrollTop = el.offsetTop - 61;
    }
}
