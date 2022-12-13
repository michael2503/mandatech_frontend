import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/data/services/auth.service';
import { ProductService } from 'src/app/data/services/guest/product.service';
import { StorageService } from 'src/app/data/services/storage.service';
import { UserProductService } from 'src/app/data/services/user/user-product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

    categories = [];

    auth;


    isLoading = true;
    products = [];

    isAddingCart = false;

    theMessage: any;
    showNotice = false;
    deleteModal = false;
    justMssg = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private productService: ProductService,
        private storageService: StorageService,
        private authService: AuthService,
        private userProductService: UserProductService,
    ) { }

    ngOnInit(): void {
        this.getAuth();
        this.route.queryParams.subscribe((param) => {
            let query = '';
            for (let key in param) {
            query += `${key}=${param[key]}${
                query.split('&').length < Object.keys(param).length ? '&' : ''
            }`;
            if (key == 'category') {
                this.selCats = param[key].split(',');
            } else {
                this[key] = +param[key];
            }
            }
            query = query ? `?${query}` : '';

            this.getProducts(query);
        });
    }


    private getAuth() {
        this.authService.user.subscribe(auth => {
          this.auth = auth;
        })
    }

    trackCat(i, item) {
        return i;
    }


    selCats = [];
    minPrice = 0;
    maxPrice = 2000;
    heighestP = 2000;

    isselected(cat) {
        return this.selCats.includes(cat);
    }

    categoryChange(inp) {
        if (inp.checked) {
        this.selCats.push(inp.value);
        } else {
        this.selCats = this.selCats.filter((c) => c != inp.value);
        }
        this.genQuery();
    }

    genQuery() {
        let query = `?minPrice=${this.minPrice}&maxPrice=${this.maxPrice}`;
        if (this.selCats.length) {
        query = `${query}&category=${this.selCats.join(',')}`;
        }
        let queryObj = {};
        for (let param of query.replace('?', '').split('&')) {
        let [key, val] = param.split('=');
        queryObj[key] = val;
        }
        this.router.navigate(['/products'], { queryParams: queryObj });
    }


    initXPos;
    dragginW;
    siblingW;
    parElW;
    toChange;
    curEl;

    priceChngStart(e, price) {
        if (e.type != 'touchstart') {
        e.preventDefault();
        }
        this.initXPos = e.type == 'mousedown' ? e.x : e.touches[0].clientX;
        this.toChange = price;
        this.dragginW = +getComputedStyle(e.target.parentElement).width.replace(
        'px',
        ''
        );
        this.parElW = +getComputedStyle(
        e.target.parentElement.parentElement
        ).width.replace('px', '');
        this.curEl = e.target.parentElement;
        let sibling =
        this.curEl.previousElementSibling || this.curEl.nextElementSibling;
        this.curEl.firstChild.classList.add('dragging');
        this.siblingW = +getComputedStyle(sibling).width.replace('px', '');
        document.onmousemove = this.priceChng;
        document.onmouseup = this.priceChngStop;
    }


    priceChng = (e) => {
        let curPos = e.type == 'mousemove' ? e.x : e.touches[0].clientX;
        let diff = curPos - this.initXPos;
        this.initXPos = curPos;
        let finalW = this.dragginW + diff;
        let wDiff =
        this.toChange == 'max' ? finalW - this.siblingW : this.siblingW - finalW;
        if (this.toChange == 'max') {
        if (diff < 0) {
            if (wDiff < 9) {
            finalW = this.siblingW + 9;
            }
        } else if (diff > 0) {
            if (finalW > this.parElW) {
            finalW = this.parElW;
            }
        }
        } else {
        if (diff < 0) {
            if (finalW < 0) {
            finalW = 0;
            }
        } else {
            if (wDiff < 9) {
            finalW = this.siblingW - 9;
            }
        }
        }
        this.dragginW = finalW;
        this.curEl.style.width = `${finalW}px`;
        this[`${this.toChange}Price`] = (finalW * this.heighestP) / this.parElW;
    };

    priceChngStop = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
        this.curEl.firstChild.classList.remove('dragging');
        this.genQuery();
    };


    limit = 12;
    page = 1;
    query = '';
    counts = 0;

    private getProducts(query) {
        this.productService.getProducts(this.limit, this.page, query).subscribe((res) => {
            if(res){
                this.products = res.data.data;
                this.counts = res.data.counts;
                this.maxPrice = res.data.maxTotal;
                this.heighestP = res.data.maxTotal;
                this.categories = res.data.category;
                this.isLoading = false;
            }
        });
    }


    singlePro;
    async addToCarts(proID){
        this.isAddingCart = true;

        this.singlePro = this.products.filter(cont => cont.id === parseInt(proID))[0];
        const result = await this.productService.addToCartFunction(proID, this.singlePro);

        if(result == 'noMore'){
            this.theMessage = "You can no longer add more of this product.";
            this.showNotice = true;
            this.justMssg = false;
            this.deleteModal = true;
            this.isAddingCart = false;
        } else {
            setTimeout(() => {
                this.isAddingCart = false;
                this.theMessage = "Successfully added to cart.";
                this.showNotice = true;
                this.deleteModal = false;
                this.justMssg = true;
                this.removeNotice();
            }, 500);
        }
    }



    addToCartsAuth(proID){
        this.isAddingCart = true;
        this.productService.addToCart(proID).subscribe(res => {
            if(res){
                this.isAddingCart = false;
            }
            this.isAddingCart = false;
        }, err => {
            if (err.error.error) {
                this.theMessage = err.error.error;
                this.showNotice = true;
                this.justMssg = false;
                this.deleteModal = true;
                this.isAddingCart = false;
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
