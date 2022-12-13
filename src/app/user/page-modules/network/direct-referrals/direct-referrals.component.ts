import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReferralService } from 'src/app/data/services/user/referral.service';

@Component({
    selector: 'app-direct-referrals',
    templateUrl: './direct-referrals.component.html',
    styleUrls: ['./direct-referrals.component.scss'],
})
export class DirectReferralsComponent implements OnInit {
    form = new FormGroup({
        username: new FormControl('', Validators.required),
    });

    limit = 10;
    page = 1;

    referrals = [];
    count = 0;

    get begin() {
        return (this.page - 1) * this.limit + 1;
    }

    get end() {
        return this.begin + this.referrals.length - 1;
    }


    constructor(private refS: ReferralService) {}

    ngOnInit(): void {
        this.getReferrals();
    }

    private getReferrals() {
        this.refS.getDirectRefs(this.limit, this.page).subscribe(({ data }) => {
            this.referrals = data.data;
            this.count = data.counts;
        });
    }

    morePage(page) {
        if (
            (this.end == this.count && page > 0) ||
            (this.page == 1 && page < 0)
        )
            return;
        this.page += page;
        this.getReferrals();
    }

    trackInp() {}

    search() {}
}
