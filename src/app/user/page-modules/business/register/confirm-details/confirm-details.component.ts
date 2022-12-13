import { Component, OnInit } from '@angular/core';
import { ReferralService } from 'src/app/data/services/user/referral.service';

@Component({
  selector: 'app-confirm-details',
  templateUrl: './confirm-details.component.html',
  styleUrls: ['./confirm-details.component.scss']
})
export class ConfirmDetailsComponent implements OnInit {
  confirming = false;
  auth;

  account;

  constructor(private refS: ReferralService) {}

  ngOnInit(): void {
    this.getAuth();
    this.getAcc();
  }

  private getAcc() {
    this.account = this.refS.userBank;
  }

  private getAuth() {
    this.auth = this.refS.currentSignupUser;
  }
}
