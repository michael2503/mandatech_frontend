import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/data/services/auth.service';

@Component({
  selector: 'app-user-right-sideinfo',
  templateUrl: './user-right-sideinfo.component.html',
  styleUrls: ['./user-right-sideinfo.component.scss'],
})
export class UserRightSideinfoComponent implements OnInit, OnDestroy {
  auth;
  authSub: Subscription;

  newMembers = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Duncan',
      username: 'jonny12',
      package: 'Bronze',
      photo: 'https://res.cloudinary.com/natures-extracts/image/upload/v1652964059/user-photo_zfdb3l.png',
      created_at: '2022-04-23 12:32:38',
    },
    {
      id: 2,
      first_name: 'John',
      last_name: 'Duncan',
      username: 'jonny12',
      package: 'Bronze',
      photo: 'https://res.cloudinary.com/natures-extracts/image/upload/v1652964059/user-photo_zfdb3l.png',
      created_at: '2022-04-23 12:32:38',
    },
    {
      id: 3,
      first_name: 'John',
      last_name: 'Duncan',
      username: 'jonny12',
      package: 'Bronze',
      photo: 'https://res.cloudinary.com/natures-extracts/image/upload/v1652964059/user-photo_zfdb3l.png',
      created_at: '2022-04-23 12:32:38',
    },
    {
      id: 4,
      first_name: 'John',
      last_name: 'Duncan',
      username: 'jonny12',
      package: 'Bronze',
      photo: 'https://res.cloudinary.com/natures-extracts/image/upload/v1652964059/user-photo_zfdb3l.png',
      created_at: '2022-04-23 12:32:38',
    },
  ];

  constructor(private authS: AuthService) {}

  trackMember(i, item) {
    return item.id;
  }

  ngOnInit(): void {
    this.getAuth();
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  private getAuth() {
    this.authSub = this.authS.user.subscribe((auth) => {
      this.auth = auth;
    });
  }
}
