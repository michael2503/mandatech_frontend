import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ReferralService } from 'src/app/data/services/user/referral.service';

@Component({
    selector: 'app-unilevel-structure',
    templateUrl: './unilevel-structure.component.html',
    styleUrls: ['./unilevel-structure.component.scss'],
})
export class UnilevelStructureComponent implements OnInit {
    form = new FormGroup({
        username: new FormControl('', Validators.required),
    });

    accOpenListener = new BehaviorSubject(-1);

    levels = [];
    page = 1;
    limit = 100;

    count = [];

    get begin() {
        return (this.page - 1) * this.limit + 1;
    }

    get end() {
        let lengths = this.levels.map((l) => l.list.length);
        return lengths.map((l) => this.begin + l - 1);
        // return this.begin + this.levels.length - 1;
    }

    constructor(private refS: ReferralService) {}

    ngOnInit(): void {
        this.getUnilevels();
    }

    private getUnilevels() {
        this.refS.getUnilevels(this.limit, this.page).subscribe((res) => {
            this.levels = res.data;
            this.count = Array(this.levels.length);
            for (let i = 0; i < this.count.length; i++) {
                this.count[i] = this.levels[i].total;
            }
        });
    }

    morePage(page, i) {
        if (
            (this.end == this.count[i] && page > 0) ||
            (this.page == 1 && page < 0)
        )
            return;
        this.page += page;
        this.getUnilevels();
    }

    trackInp() {}

    search() {}
}
