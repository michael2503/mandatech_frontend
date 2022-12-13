import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, map, of, tap } from 'rxjs';
import { AuthService } from '../auth.service';
import { ConfigService } from '../config.service';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private baseUrl;
    auth;

    cartOwner;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private http: HttpClient,
        private configS: ConfigService,
        private authS: AuthService
    ) {
        authS.user.subscribe((auth) => {
            this.auth = auth;
        });
        this.baseUrl = configS.baseUrl;
    }

    cartItems = new BehaviorSubject(null);

    cartAlert = new BehaviorSubject(null);

    checkoutStatus = new BehaviorSubject(false);

    getLocalCarts() {
        let carts = localStorage.getItem('cartItems');
        if (carts) {
            this.cartItems.next(JSON.parse(carts));
        }
    }

    verifyUser(user, packageId, page) {
        return this.http
            .get<any>(`${this.baseUrl}product-manager/verify-user/${user}`)
            .pipe(
                tap((res) => {
                    this.cartOwner = {...res.data.user, selectedPackage: packageId, page: page};
                    this.cartItems.next(res.data.carts);
                    localStorage.setItem(
                        'cartOwner',
                        JSON.stringify(this.cartOwner)
                    );
                })
            );
    }

    storeSelectPackage(id) {
        if (this.cartOwner) {
            this.cartOwner.selectedPackage = id;
            localStorage.setItem('cartOwner', JSON.stringify(this.cartOwner));
        }
    }

    storeUpdatePackage(id) {
        this.cartOwner.updatedPackage = id;
        localStorage.setItem('cartOwner', JSON.stringify(this.cartOwner));
    }

    fetchCartOwner() {
        let cartOwner = localStorage.getItem('cartOwner');
        this.cartOwner = cartOwner ? JSON.parse(cartOwner) : null;
    }

    getCarts() {
        let cartPids = 'none';
        let cartItems = this.cartItems.value;
        let cartArr;
        if (!this.cartOwner) {
            if (cartItems) {
                cartPids = cartItems.map((c) => c.pid).join(',');
                if (!cartPids)
                    return of({ data: [] }).pipe(
                        tap((res) => {
                            this.cartItems.next(res.data);
                        })
                    );
            } else {
                return of({ data: [] }).pipe(
                    tap((res) => {
                        this.cartItems.next(res.data);
                    })
                );
            }
        }
        return this.http
            .get<any>(
                `${this.baseUrl}product-manager/cart/${this.cartOwner.username}`
            )
            .pipe(
                map((res) => {
                    let returnCart;
                    if (this.auth) {
                        return res;
                    } else {
                        cartItems.forEach((c) => {
                            let matchCart = res.data.find(
                                (rc) => rc.id == c.pid
                            );
                            c.prodInfo = matchCart;
                        });
                        return {
                            data: cartArr,
                        };
                    }
                }),
                tap((res) => {
                    this.cartItems.next(res.data);
                })
            );

        return of({
            data: [
                {
                    prodInfo: {
                        featured_img:
                            'https://res.cloudinary.com/natures-extracts/image/upload/v1652193219/product-2_ws9btl.png',
                        name: 'Amino 6000 Super Whey Formula',
                        sales_price: 8190,
                        size: '300ml',
                        available_quantity: 20,
                        pid: 1,
                    },
                    quantity: 1,
                    pid: 1,
                    id: 1,
                },
            ],
        }).pipe(
            tap((res) => {
                this.cartItems.next(res.data);
            })
        );
    }

    reduceCart(cart, qty) {
        if (this.cartOwner) {
            return this.http
                .get<any>(
                    `${this.baseUrl}user/product-manager/reduce-cart/${cart.id}/${qty}`
                )
                .pipe(
                    tap((res) => {
                        this.updateCart(res.data, false);
                    })
                );
        }
        let carts = this.cartItems.value;
        let match = carts.find((c) => c.pid == cart.pid);
        let toUpd = { ...match, quantity: match.quantity - 1 };
        return of({ data: toUpd }).pipe(
            tap((res) => {
                this.updateCart(toUpd, false);
            })
        );
    }

    updateLocalCart(carts) {
        if (!this.auth) {
            localStorage.setItem('cartItems', JSON.stringify(carts));
        }
    }

    deleteCartItem(cart) {
        if (this.auth) {
            return this.http
                .delete<any>(
                    `${this.baseUrl}user/product-manager/delete-cart/${cart.id}`
                )
                .pipe(
                    tap((res) => {
                        this.finalCartRemove(cart.pid);
                    })
                );
        }
        return of({ data: 'success' }).pipe(
            tap((res) => {
                this.finalCartRemove(cart.pid);
            })
        );
    }

    finalCartRemove(pid) {
        let carts = this.cartItems.value;
        carts = carts.filter((c) => c.pid != pid);
        this.cartItems.next(carts);
        this.updateLocalCart(carts);
    }

    addToCart(prod, qty = 1) {
        let carts = this.cartItems.value;
        let match = carts.find((cart) => cart.pid == prod.id);
        if (this.cartOwner) {
            return this.http
                .get<any>(
                    `${this.baseUrl}user/product-manager/add-to-cart/${this.cartOwner.username}/${prod.id}/${qty}`
                )
                .pipe(
                    tap(({ data }) => {
                        this.updateCart(data);
                    })
                );
        }
        let toadd = match
            ? { ...match, quantity: match.quantity + qty }
            : {
                  quantity: qty,
                  pid: prod.id,
                  prodInfo: prod,
              };
        return of({ data: toadd }).pipe(
            tap(({ data }) => {
                this.updateCart(data);
            })
        );
    }

    updateCart(data, add = true) {
        let carts = this.cartItems.value;
        let matchInd = -1;
        for (let i = 0; i < carts.length; i++) {
            if (carts[i].pid == data.pid) {
                matchInd = i;
                break;
            }
        }
        if (matchInd > -1) {
            carts[matchInd] = data;
        } else {
            carts.unshift(data);
        }
        this.cartItems.next(carts);
        if (add) {
            this.cartAlert.next(data);
        }
        this.updateLocalCart(carts);
    }

    clearCarts() {
        this.cartItems.next([]);
        this.cartOwner = null;
        localStorage.removeItem('cartItems');
        localStorage.removeItem('cartOwner');
    }

    checkout(data) {
        return this.http.post<any>(
            `${this.baseUrl}user/product-manager/place-order`,
            data
        ).pipe(tap(res => {
            this.clearCarts();
        }));
    }
}
