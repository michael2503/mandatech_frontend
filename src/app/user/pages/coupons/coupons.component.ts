import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserSettingsService } from 'src/app/data/services/user/user-settings.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {

    pageLimit = 10;
    currentPage = 0;
    coupons = [];
    couponsCount = 0;

    pageLoader = true;
    isLoadMore = false;

    isSearching = false;

    formSearch = new FormGroup({
        keywords: new FormControl('', []),
    });



    constructor(
        private userSettingsService: UserSettingsService,
    ) { }

    ngOnInit(): void {
        this.getAllCoupons()
    }


  private getAllCoupons(isMore = false){
    this.userSettingsService.getCoupons(this.pageLimit, this.currentPage).subscribe(res => {
        if(res){
            if(isMore){
                for(let i = 0; i < res.data.data.length; i++){
                    this.coupons.push(res.data.data[i]);
                }
            } else {
                this.coupons = res.data.data;
            }
            this.couponsCount = res.data.counts;
        }
        this.pageLoader = false;
        console.log(this.currentPage)
    })
  }


  loadMore(){
    this.isLoadMore = true;
    if(this.couponsCount > this.coupons.length){
        this.currentPage++;
        this.getAllCoupons(true);
    }
    this.isLoadMore = false;
  }


    submit() {
        this.isSearching = true;
        const data = this.formSearch.value.keywords;
        this.userSettingsService.searchCoupon(data).subscribe(res => {
            if (res) {
                this.coupons = res.data.data;
                this.couponsCount = res.data.counts;
            } else {
                this.coupons = [];
            }
            this.isSearching = false;
            this.isSearching = false;
        })
    }

    cancelSearch(){
        this.formSearch.reset();
        this.getAllCoupons();
    }



}
