import { Component, Input, OnInit } from '@angular/core';
import { CartService } from 'src/app/data/services/guest/cart.service';
import { ProductService } from 'src/app/data/services/guest/product.service';

@Component({
  selector: 'app-each-product',
  templateUrl: './each-product.component.html',
  styleUrls: ['./each-product.component.scss'],
})
export class EachProductComponent implements OnInit {
  @Input() product = {
    pid: 1,
    featured_img: 'assets/images/product.png',
    name: 'NARIPOSHK',
    overview: "Antibio healthy you formula women's multivitaminstics",
    sales_price: 1500,
    star_rate: 3,
  };

  adding;

  @Input() related = false;

  curr = '₦';

  constructor(private cartS: CartService) {}

  ngOnInit(): void {}

  numArr(n) {
    return Array(n).fill(0);
  }

  addToCart(e) {
    // e.stopPropagation();
    // e.preventDefault();
    // this.adding = this.product.pid;
    // this.cartS.addToCart(this.product).subscribe((res) => {
    //   this.adding = null;
    // });
  }
}
