import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/data/services/auth.service';
import { FileUploadService } from 'src/app/data/services/file-upload.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { ProductService } from 'src/app/data/services/guest/product.service';
import { StorageService } from 'src/app/data/services/storage.service';
import { UserProductService } from 'src/app/data/services/user/user-product.service';
import { UserSettingsService } from 'src/app/data/services/user/user-settings.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

    isLoading = true;

    banks = [];

    theMessage: any;
    showNotice = false;
    deleteModal = false;
    justMssg = false;

    isSubmitting =false;

    addresses = [];

    form = new FormGroup({
        address: new FormControl('', [ Validators.required ]),
        payment_method: new FormControl('', [ Validators.required ]),
        pop: new FormControl('', []),
        couponID: new FormControl('', []),
    })

    accOpenListiner = new BehaviorSubject(-1);

    activePageModule;

    constructor(
        private storageService: StorageService,
        private productService: ProductService,
        private authS: AuthService,
        private router: Router,
        private fileUploadService: FileUploadService,
        private userProductService: UserProductService,
        private generalSerttingsService: GeneralSettingsService,
        private userSettingsService: UserSettingsService
    ) { }

    auth;

    ngOnInit(): void {
        this.getComingFrom();
        // this.getDefaultCart();
        this.theCartList();
        this.getAuth();
        this.getAddress();
        this.activePageModule = this.router.url.split('/')[2];
        this.generalSerttings();
    }

    private getAuth() {
        this.authS.user.subscribe(auth => {
            this.auth = auth;
        });
    }


    private async getComingFrom(){
        await this.storageService.remove('comingFrom');
    }


    carts = [];
    cartCount = 0;
    totalCartAmt = 0;

    private async theCartList(){
        this.productService.getCarts().subscribe(res => {
            if(res){
                this.carts = res.data;
                this.totalCartAmt = 0;
                if(this.carts){
                    for (let i = 0; i < this.carts.length; i++) {
                    this.totalCartAmt += this.carts[i].qty * this.carts[i].sales_price;
                    }
                }
            }
        })
    }

    selectedAdd;
    selectAddress(addId){
        this.selectedAdd = addId;
        this.form.get('address').setValue(addId);
    }


    private getAddress(){
        this.userSettingsService.getAllAddress().subscribe(res => {
            if(res){
                this.addresses = res.data;
            }
            this.isLoading = false;
        })
    }


    async submit(){
        const pop = this.form.get('pop').value;
        const payMethod = this.form.get('payment_method').value;
        if(payMethod == 'Bank' && (pop == '' || !pop)){
            this.theMessage = "Oops, please upload a proof of payment.";
            this.showNotice = true;
            this.justMssg = false;
            this.deleteModal = true;
            return;
        }
        this.isSubmitting = true;
        const data = JSON.stringify(this.form.value);
        this.userProductService.submitCheckout(data).subscribe(res => {
            if(res){
                this.theCartList();
                this.router.navigateByUrl('/user/order-manager');
            }
        })

    }

    activeMethod = '';
    selectMethod(role){
        this.activeMethod = role;
        this.form.get('payment_method').setValue(role);
    }



    // UPLOADING
    selectedFile: File = null;
    selectedFileName: string;
    uploadedFile: string;
    uploadingProgress = 0;
    logoUploadingProgress = 0;
    bannerUploadErr;
    uploadedBanners = '';
    uploadedBannersEdit = '';


    onloadFile(eventAlt) {
        this.logoUploadingProgress = 1;
        this.uploadingProgress = 0;
        const selectedFile = <File>eventAlt.target.files[0];
        //
        const reader = new FileReader();
        const img = new Image();
        img.src = window.URL.createObjectURL( selectedFile );
        reader.readAsDataURL(selectedFile);
        reader.onload = () => {
            const width = img.naturalWidth;
            const height = img.naturalHeight;

            this.uploadFile(selectedFile, 'service', 1, 1, 1000, 1000);
        };
    }


    private uploadFile(selectedFile, name, width, height, mxWidth, mxHeight) {
        const fd = new FormData;
        fd.append('file', selectedFile, selectedFile.name);
        this.fileUploadService.cloudUpload(
        fd, 'projects', name
        )
        .subscribe(
        event => {
            if (event.type === HttpEventType.UploadProgress) {
                this.uploadingProgress = Math.round(event.loaded / event.total * 100 );
            } else if (event.type === HttpEventType.Response) {
                if (event.body.secure_url) {
                    this.form.get('pop').setValue(event.body.secure_url);
                    this.uploadedBanners = event.body.secure_url;

                    this.bannerUploadErr = false
                }
                this.uploadingProgress = 0;
                this.logoUploadingProgress = 0;
            }
        },
        err => {

        }
        );
    }


    private generalSerttings(){
        this.generalSerttingsService.getGenSettings().subscribe(res => {
            if(res){
                this.banks = res.data.banks;
            }
        })
    }

    removeLabelBanner = true;
    removeUploadBanner(){
        this.uploadedBanners = '';
        this.removeLabelBanner = true;
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

    couponCode;
    isSearching = false;
    coupon;
    getValue(event){
        this.couponCode = event.target.value;
    }

    submitCoupon(){
        console.log(this.couponCode)
        this.isSearching = true;
        this.userProductService.checkCoupon(this.couponCode).subscribe(res => {
            if(res){
                this.coupon = res.data;
                this.form.get("couponID").setValue(this.coupon.id);
            }
            this.isSearching = false;
        }, (err) => {
            this.isSubmitting = false;
            let error = err?.error?.error;
            if (error) {
                this.theMessage = error;
                this.showNotice = true;
                this.justMssg = false;
                this.deleteModal = true;
                this.removeNotice();
            }
            this.isSearching = false;
        })
    }

    removeCoupon(){
        this.coupon = '';
        this.form.get("couponID").setValue('');
    }

}
