import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/data/services/user/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

    orderNum;
    order;
    pageLoader = true;
    products = [];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
  ) { }

  ngOnInit(): void {
    this.orderNum = this.route.snapshot.paramMap.get('orderNumber');
    this.orderSingle();
  }


  private orderSingle(){
    this.orderService.getOrderSingle(this.orderNum).subscribe(res => {
        if(res){
            this.order = res.data;
            this.products = JSON.parse(this.order.cart_info);
        }
        this.pageLoader = false;
    })
  }



}
