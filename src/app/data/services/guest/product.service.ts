import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of, tap } from 'rxjs';
import { ConfigService } from '../config.service';
import { StorageService } from '../storage.service';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private baseUrl;

    private singlePro;
    cartItem;

    newArr = [];
    unStringify = [];

    constructor(
        private http: HttpClient,
        private configS: ConfigService,
        private storageService: StorageService
    ) {
        this.baseUrl = configS.baseUrl;
    }


    getProducts(limit, page, query) {
        return this.http.get<any>(
            `${this.baseUrl}content/products/${limit}/${page}${query}`
        );
    }


    singleProduct(pid, name) {
        return this.http.get<any>(
            `${this.baseUrl}content/products/single/${pid}/${name}`
        );
    }


    postReview(data) {
        return this.http.post<any>(
            `${this.baseUrl}content/products/review/post`, data
        );
    }


    public async addToCartFunction(proID, oneProduct){
        this.singlePro = oneProduct;
        ['added_by', 'specifications', 'status', 'updated_at', 'created_at'].forEach(e => delete this.singlePro[e]);
        this.singlePro['qty'] = 1;

        this.cartItem =  await this.storageService.getString('storeCarts');

        if(this.cartItem){
            this.unStringify = JSON.parse(this.cartItem);
            const check = this.unStringify.filter(cont => cont.id === parseInt(proID))[0];
            if(check){
                const avail = this.singlePro.quantity - this.singlePro.sold;
                const newQty = check.qty + 1;
                if(newQty > avail){
                    return 'noMore';
                }
                check['qty'] = newQty;
                this.storageService.storeString('storeCarts', JSON.stringify(this.unStringify));
            } else {
                this.unStringify.push(this.singlePro);
                this.storageService.storeString('storeCarts', JSON.stringify(this.unStringify));
            }

        } else {
            this.newArr.push(this.singlePro);
            this.storageService.storeString('storeCarts', JSON.stringify(this.newArr));
        }

        setTimeout(() => {
            return this.forCartList();
            // return this.toGetStrint();
        }, 500);

        return 'success';
    }

    cartCount = new BehaviorSubject(null);
    cartList = new BehaviorSubject(null);

    // cartCount;
    // async toGetStrint(){
    //     const toCount = await this.storageService.getString('storeCarts');
    //     const showCount = JSON.parse(toCount);
    //     if(showCount){
    //         this.cartCount.next(showCount.length)
    //     } else {
    //         this.cartCount.next(0)
    //     }
    //     return of({ data: showCount.length }).pipe(
    //         tap((res) => {
    //             this.cartCount.next(res.data);
    //         })
    //     );
    // }

    async forCartList(){
        const toCount = await this.storageService.getString('storeCarts');
        const showCount = JSON.parse(toCount);
        if(showCount){
            this.cartList.next(showCount)
        } else {
            this.cartList.next({ data: []})
        }
        return of({ data: showCount }).pipe(
            tap((res) => {
                this.cartList.next(res.data);
            })
        );
    }


    addToCart(pid) {
        return this.http.get<any>(
            `${this.baseUrl}user/product/add-to-cart/${pid}`,
        ).pipe(
            tap((res) => {
                this.cartList.next(res.data);
            })
        );
    }

    get headerCart() {
        return this.cartCount.asObservable();
    }

    get theCartList() {
        return this.cartList.asObservable();
    }


    public async toAddOrMinus(proID, role){
        this.cartItem =  await this.storageService.getString('storeCarts');
        if(this.cartItem){
            this.unStringify = JSON.parse(this.cartItem);
            const check = this.unStringify.filter(cont => cont.id === parseInt(proID))[0];
            if(check){
                if(role == 'add'){
                    //add to cart
                    const avail = check.quantity - check.sold;
                    const newQty = check.qty + 1;
                    if(newQty > avail){
                        return 'noMoreAdd';
                    }
                    check['qty'] = newQty;
                    this.storageService.storeString('storeCarts', JSON.stringify(this.unStringify));

                } else if(role == 'minus'){
                    // remove from card
                    if(check.qty == 1){
                        return 'noMoreMinus';
                    }
                    const newQty = check.qty - 1;
                    check['qty'] = newQty;
                    this.storageService.storeString('storeCarts', JSON.stringify(this.unStringify));
                }
            }
        }
        setTimeout(() => {
            return this.forCartList();
            // return this.toGetStrint();
        }, 500);

        return 'success';
    }


    async removeFromCart(arrNum){
        this.cartItem =  await this.storageService.getString('storeCarts');
        if(this.cartItem){
            this.unStringify = JSON.parse(this.cartItem);
            this.unStringify.splice(arrNum, 1);
            this.storageService.storeString('storeCarts', JSON.stringify(this.unStringify));
        }
        setTimeout(() => {
            return this.forCartList();
        }, 500);

        return 'success';
    }

    deleteCart(cartID){
        return this.http.delete<any>(
            `${this.baseUrl}user/product/delete-carts/${cartID}`,
        ).pipe(
            tap((res) => {
                // console.log(res);
                this.cartList.next(res.data);
            })
        );
    }

    authAddMinusCart(cartID, role){
        return this.http.get<any>(
            `${this.baseUrl}user/product/add-remove/${cartID}/${role}`,
        ).pipe(
            tap((res) => {
                this.cartList.next(res.data);
            })
        );
    }

    getCarts(){
        return this.http.get<any>(
            `${this.baseUrl}user/product/get-carts`,
        ).pipe(
            tap((res) => {
                this.cartList.next(res.data);
            })
        );
    }


}
