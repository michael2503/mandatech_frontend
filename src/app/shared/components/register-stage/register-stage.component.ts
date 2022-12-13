import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-register-stage',
  templateUrl: './register-stage.component.html',
  styleUrls: ['./register-stage.component.scss'],
})
export class RegisterStageComponent implements OnInit {
  @Input() stage;
  @Input() totalStage = 7;

  get stages() {
    return Array(this.totalStage).fill(0);
  }

  constructor() {}

  ngOnInit(): void {}
}
