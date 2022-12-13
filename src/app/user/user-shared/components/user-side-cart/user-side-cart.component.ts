import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { CartService } from 'src/app/data/services/guest/cart.service';

@Component({
    selector: 'app-user-side-cart',
    templateUrl: './user-side-cart.component.html',
    styleUrls: ['./user-side-cart.component.scss'],
})
export class UserSideCartComponent implements OnInit, OnDestroy {
    carts = [];
    @Input() form: FormGroup;

    curr;

    get total() {
        return eval(
            this.carts.map((c) => c.quantity * c.prodInfo.sales_price).join('+')
        );
    }

    get totalPv() {
        return eval(
            this.carts.map((c) => c.quantity * c.prodInfo.point_value).join('+')
        );
    }

    genSub: Subscription;
    cartSub: Subscription;

    deleting;
    reducing;
    adding;
    updating = { id: null, qty: null };

    checkoutStatus = false;

    activeUrl;

    constructor(private cartS: CartService, private router: Router) {}

    ngOnDestroy(): void {
        this.cartSub?.unsubscribe();
    }

    trackCart(i, item) {
        return JSON.stringify(item);
    }

    ngOnInit(): void {
        this.activeUrl = this.router.url.split('/').slice(-1)[0];
        this.getCarts();
        this.getCheckoutStatus();
    }

    private getCheckoutStatus() {
        this.cartS.checkoutStatus.subscribe((checkout) => {
            this.checkoutStatus = checkout;
        });
    }

    private getCarts() {
        this.cartSub = this.cartS.cartItems.subscribe((res) => {
            if (res) {
                this.carts = res;
            }
        });
    }

    deleteCart(cart) {
        this.deleting = cart.id;
        this.cartS.deleteCartItem(cart).subscribe((_) => {
            this.deleting = null;
        });
    }

    checkout() {
        if (!this.checkoutStatus) return;
        localStorage.setItem('checkoutData', JSON.stringify(this.form.value));
        this.router.navigateByUrl(`/user/business/${this.activeUrl}/order-summary`);
    }

    reduceCart(cart, qty) {
        // e.stopPropagation();
        // e.preventDefault();
        this.reducing = cart.id;
        this.cartS.reduceCart(cart, qty).subscribe((_) => {
            this.reducing = null;
            this.updating = { id: null, qty: null };
        });
    }

    addToCart(cart, qty) {
        // e.stopPropagation();
        // e.preventDefault();
        this.adding = cart.id;
        this.cartS.addToCart(cart.prodInfo, qty).subscribe((_) => {
            this.adding = null;
            this.updating = { id: null, qty: null };
        });
    }

    qtyCtrl(cart, n) {
        let qty = cart.quantity;
        if (
            (n == -1 && qty < 2) ||
            (n == 1 && cart.prodInfo.available_quantity <= qty)
        )
            return;
        this.updating = { id: cart.id, qty: qty };
        this.updating.qty += n;
        let qtyUpdateInterval;
        const stopUpdate = () => {
            if (n == 1) {
                this.addToCart(cart, this.updating.qty - cart.quantity);
            } else {
                this.reduceCart(cart, cart.quantity - this.updating.qty);
            }
            clearInterval(delay);
            clearInterval(qtyUpdateInterval);
            document.onmouseup = null;
        };
        document.onmouseup = stopUpdate;
        let delay = setTimeout(() => {
            qtyUpdateInterval = setInterval(() => {
                if (
                    (cart.prodInfo.available_quantity == this.updating.qty &&
                        n == 1) ||
                    (n == -1 && this.updating.qty < 2)
                ) {
                    clearInterval(qtyUpdateInterval);
                    return;
                }
                this.updating.qty += n;
            }, 100);
        }, 1000);
    }
}
