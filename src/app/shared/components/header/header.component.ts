import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/data/services/auth.service';
import { ErrorHandlerService } from 'src/app/data/services/error-handler.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { CartService } from 'src/app/data/services/guest/cart.service';
import { SuccessService } from 'src/app/data/services/success.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  dropMenu = false;
  auth;
  closeModal = new BehaviorSubject(false);
  successMsg;
  logoUrl;

  @Input() searchBar = true;

  cartItems = [];
  errorMsg;
  @ViewChild('successOpener') successOpener: ElementRef;
  @ViewChild('errorOpener') errorOpener: ElementRef;
  @ViewChild('cookiePopup') cookiePopup: ElementRef;

  searchForm = new FormGroup({
    keyword: new FormControl('', Validators.required),
  });

  get total() {
    if (!this.cartItems.length) return 0;
    return eval(
      this.cartItems.map((c) => c.prodInfo.sales_price * c.quantity).join('+')
    );
  }

  get cartCount() {
    if (!this.cartItems.length) return 0;
    return eval(this.cartItems.map((c) => c.quantity).join('+'));
  }

  cur = '₦';

  submitting = false;

  settings;

  cookie;

  cartAlerts = [
    /*{ name: 'Amino 6000 Super Whey Formula' }*/
  ];

  alertRemain = [];

  deleting;

  constructor(
    private authService: AuthService,
    private successService: SuccessService,
    private errorService: ErrorHandlerService,
    private generalSettings: GeneralSettingsService,
    private router: Router,
    private cartS: CartService
  ) {}

  ngOnInit(): void {
    this.getAuth();
    this.getSettings();
    this.getCarts();
    this.getAlerts();
  }

  trackAlert(i, item) {
    return item.count;
  }

  existCount(count) {
    return this.alertRemain.find((c) => c == count);
  }

  count = 0;

  private getAlerts() {
    this.cartS.cartAlert.subscribe((cart) => {
      if (cart) {
        this.cartS.cartAlert.next(null);
        let prodStr = JSON.stringify(cart.prodInfo);
        let prod = JSON.parse(prodStr);
        this.count++;
        prod.count = this.count;
        this.alertRemain.push(this.count);
        this.cartAlerts.push(prod);
        setTimeout(() => {
          this.alertRemain.shift();
        }, 4600);
        setTimeout(() => {
          this.cartAlerts.shift();
        }, 5200);
      }
    });
  }

  private getCarts() {
    this.cartS.cartItems.subscribe((res) => {
      if (res) {
        this.cartItems = res;
      }
    });
  }

  ngAfterViewInit() {
    this.checkSuccessMsg();
    // this.checkErrorMsg();

    this.checkCookie();
  }

  private checkCookie() {
    // this.authService.cookie.subscribe((res) => {
    //   this.cookie = res;
    //   this.cookiePopup.nativeElement.style.setProperty(
    //     '--scrollBw',
    //     `${window.innerWidth - document.body.clientWidth}px`
    //   );
    // });
  }

  trackCart(i, item) {
    return i;
  }

  acceptCookie() {
    // this.authService.setCookie();
  }

  private getSettings() {
    this.generalSettings.genSettings.subscribe((res) => {
      if (res) {
        this.settings = res.websiteSettings;
        this.logoUrl = res.websiteSettings.logo_url;
      }
    });
  }

  deleteCart(e, cart) {
    e.stopPropagation();
    e.preventDefault();
    this.deleting = cart.pid;
    this.cartS.deleteCartItem(cart).subscribe((_) => {
      this.deleting = null;
    });
  }

  private checkSuccessMsg() {
    this.successService.msg.subscribe((msg) => {
      if (msg) {
        this.successMsg = msg;
        this.successOpener.nativeElement.click();
      }
    });
  }

  private checkErrorMsg() {
    this.errorService.errorResp.subscribe((err) => {
      if (err) {
        this.errorMsg =
          'Oops! An error occured. Please reload the page and try again later';
        this.errorOpener.nativeElement.click();
      }
    });
  }

  modalClose() {
    if (this.successMsg?.callBack) {
      this.successMsg.callBack();
    }
    this.successService.msg.next(null);
  }

  errorClose() {
    this.errorService.errorResp.next(null);
  }

  private getAuth() {
    this.authService.user.subscribe((auth) => {
      this.auth = auth;
    });
  }
}
