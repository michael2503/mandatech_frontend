import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-transaction',
  templateUrl: './empty-transaction.component.html',
  styleUrls: ['./empty-transaction.component.scss']
})
export class EmptyTransactionComponent implements OnInit {
  @Input() msg;
  constructor() { }

  ngOnInit(): void {
  }

}
