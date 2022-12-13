import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-btn',
  templateUrl: './loading-btn.component.html',
  styleUrls: ['./loading-btn.component.scss']
})
export class LoadingBtnComponent implements OnInit {
  @Input() clss;
  constructor() { }

  ngOnInit(): void {
  }

}
