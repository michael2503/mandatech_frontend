import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/data/services/auth.service';
import { ProductService } from 'src/app/data/services/guest/product.service';

@Component({
  selector: 'app-product-single',
  templateUrl: './product-single.component.html',
  styleUrls: ['./product-single.component.scss']
})
export class ProductSingleComponent implements OnInit {

    pid;
    name;
    quantity = 1;
    curr = '₦';

    isPosting = false;
    isLoading = true;

    theMessage: any;
    showNotice = false;
    deleteModal = false;
    justMssg = false;

    isAddingCart = false;

    form = new FormGroup({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      comment: new FormControl('', [Validators.required]),
      star_rate: new FormControl('', [Validators.required]),
      pid: new FormControl('', [Validators.required]),
    })

    n(n) {
        return this.form.get(n);
    }

    category = [
      { name: "Men's Health", slug: 'mens_health' },
      { name: "Men's Multivitamins", slug: 'mens_multivitamins' },
    ];

    imgResizeConfig = [
      { minW: 300, slideNo: 4 },
      { maxW: 300, slideNo: 3 },
    ];

    relatedResizeConfig = [
      { minW: 900, slideNo: 4 },
      { minW: 700, maxW: 900, slideNo: 3 },
      { minW: 350, maxW: 700, slideNo: 2 },
      { maxW: 350, slideNo: 1 },
    ];

    activeTab = 'description';

    reviewGroup = [];
    availQty = 20;
    reviews = [];
    adding = false;
    product;
    relatedProd = [];
    topRated = [];
    auth;

    constructor(
      private route: ActivatedRoute,
      private productService: ProductService,
      private authService: AuthService
    ) {}

    numRate(n) {
      return Array(n).fill(0);
    }

    trackRated(i, item) {
      return item.pid;
    }

    ngOnInit(): void {
        this.getAuth();
      this.route.params.subscribe((param) => {
        this.relatedProd = [];
        this.images;
        this.pid = param['id'];
        this.name = param['title'];
        this.getProduct();
      });
    }

    images = [];

    stock;
    samePro = [];

    private getAuth() {
        this.authService.user.subscribe(auth => {
          this.auth = auth;
        })
    }


    private getProduct() {
      this.productService.singleProduct(this.pid, this.name).subscribe(res  => {
        if(res){
            this.product = res.data.data;
            this.samePro = res.data.sameProduct;
            this.reviews = res.data.reviews;
            this.groupReview();
            this.images = JSON.parse(this.product.images);
            this.form.get('pid').setValue(this.product.id);
            if((this.product.quantity - this.product.sold) > 0){
                this.stock = 'In Stock';
            } else {
                this.stock = 'Out of Stock';
            }

            setTimeout(() => {
                // this.relatedProd = res.relatedProd;

            });
            this.isLoading = false;
        }
      });
    }


    getStarRate(star){
        const theStar = star;
        this.form.get('star_rate').setValue(theStar);
        console.log(theStar)
    }


    submit(){
        if (this.form.invalid) return;
        this.isPosting = true;
        const data = JSON.stringify(this.form.value);
        this.productService.postReview(data).subscribe(res => {
            console.log(res)
            if(res){
                this.theMessage = "Comment successfully submitted.";
                this.showNotice = true;
                this.deleteModal = false;
                this.justMssg = true;
                this.removeNotice();
                this.form.reset();
            }
            this.isPosting = false;
        })
    }

    private groupReview() {

    }

    qtyCtrl(n) {
      if (
        (n == -1 && this.quantity < 2) ||
        (n == 1 && this.availQty <= this.quantity)
      )
        return;
      this.quantity += n;
      let qtyUpdateInterval;
      function stopUpdate() {
        clearInterval(delay);
        clearInterval(qtyUpdateInterval);
        document.onmouseup = null;
      }
      document.onmouseup = stopUpdate;
      let delay = setTimeout(() => {
        qtyUpdateInterval = setInterval(() => {
          if (
            (this.availQty == this.quantity && n == 1) ||
            (n == -1 && this.quantity < 2)
          ) {
            clearInterval(qtyUpdateInterval);
            return;
          }
          this.quantity += n;
        }, 100);
      }, 1000);
    }


    async addToCarts(){
        this.isAddingCart = true;

        const result = await this.productService.addToCartFunction(this.product.id, this.product);

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
        }, 5000);
    }

    closeMyNotice() {
        this.showNotice = false;
    }


    singlePro;
    async addToCartsSamePro(proID){
        this.isAddingCart = true;

        this.singlePro = this.samePro.filter(cont => cont.id === parseInt(proID))[0];
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

}
