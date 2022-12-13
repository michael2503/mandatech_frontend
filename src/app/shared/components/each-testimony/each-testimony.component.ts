import { Component, Input, OnInit } from '@angular/core';
import { CartService } from 'src/app/data/services/guest/cart.service';

@Component({
  selector: 'app-each-testimony',
  templateUrl: './each-testimony.component.html',
  styleUrls: ['./each-testimony.component.scss']
})
export class EachTestimonyComponent implements OnInit {

    @Input() testimony;

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
