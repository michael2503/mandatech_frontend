import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss']
})
export class UserLayoutComponent implements OnInit {
  @Input() pageTitle;
  @Input() form;

  @Input() sidebar;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.pageTitle = this.pageTitle || this.router.url.split('/').slice(-1)[0].split('-').map(w => w.replace(w[0], w[0].toUpperCase())).join(' ');
  }

}
