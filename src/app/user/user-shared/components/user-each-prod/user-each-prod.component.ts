import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { CartService } from 'src/app/data/services/guest/cart.service';

@Component({
    selector: 'app-user-each-prod',
    templateUrl: './user-each-prod.component.html',
    styleUrls: ['./user-each-prod.component.scss'],
})
export class UserEachProdComponent implements OnInit, OnDestroy {
    @Input() product;
    curr;
    adding;

    genSub: Subscription;

    constructor(
        private genS: GeneralSettingsService,
        private cartS: CartService
    ) {}

    ngOnDestroy(): void {
        this.genSub?.unsubscribe();
    }

    ngOnInit(): void {
        this.getCurrency();
    }

    private getCurrency() {
        this.genSub = this.genS.genSettings.subscribe(res => {
            this.curr = res?.currency?.symbol;
        });
    }

    addToCart() {
        this.adding = this.product.id;
        this.cartS.addToCart(this.product, 1).subscribe(res => {
            this.adding = null;
        });
    }
}
