import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutingService } from 'src/app/data/helpers/routing.service';
import { OrderService } from 'src/app/data/services/user/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

    status = "all";
    pageLoader = true;

    constructor(
        private rout: RoutingService,
        private orderService: OrderService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(param => {
            this.status = param['status'];
            this.getAllOrders()
        });
    }


    pageLimit = 5;
    currentPage = 1;
    isLoading = false;
    isLoadMore = false;
    orders = [];
    orderCount = 0;

    private getAllOrders(isMore = false) {
        this.isLoading = true;
        this.orderService.getAllOrder(
        this.status, this.pageLimit, this.currentPage
        ).subscribe(res => {
        if (res.data) {
            if (isMore) {
                for (let i = 0; i < res.data.data.length; i++) {
                    this.orders.push(res.data.data[i]);
                }
            } else {
                this.orders = res.data.data;
            }
            this.orderCount = res.data.counts;
        }
        this.pageLoader = false;
        this.isLoading = false;
        this.isLoadMore = false;
        });
    }


    loadMore() {
        this.isLoadMore = true;
        if (this.orderCount > this.orders.length) {
          this.currentPage++;
          this.getAllOrders(true);
        }
    }

}
