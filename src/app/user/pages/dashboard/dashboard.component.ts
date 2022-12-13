import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/data/services/auth.service';
import { UserSettingsService } from 'src/app/data/services/user/user-settings.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    auth;

    coupons = [];
    orders = [];
    allOrder = 0;
    activeCoupon = 0;
    activeOrder = 0;

    constructor(
        private authService: AuthService,
        private userSerttingsService: UserSettingsService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.getAuth();
        this.dashboardInfo();
    }


    private getAuth() {
        this.authService.user.subscribe(auth => {
          this.auth = auth;
          console.log(this.auth)
          if(!this.auth){
            this.router.navigateByUrl("/login");
          }
        })
    }


    private dashboardInfo(){
        this.userSerttingsService.dashboard().subscribe(res => {
            if(res){
                this.orders = res.data.recentOrder;
                this.coupons = res.data.recentCoupon;
                this.allOrder = res.data.allOrder;
                this.activeCoupon = res.data.activeCoupon;
                this.activeOrder = res.data.activeOrder;
            }
        })
    }

}
